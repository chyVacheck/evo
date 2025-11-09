/**
 * @file ParseBody.middleware.ts
 * @module core/middleware
 *
 * @description
 * Парсит тело запроса и добавляет его в `ctx.body`.
 * Для использования этого миддлвар, нужно добавить его в пайплайн используя метод `useBefore` перед обработкой запроса.
 */

/**
 * ! my imports
 */
import { BeforeMiddlewareModule } from '@core/base';
import {
	AnyHttpContext,
	EHttpMethod,
	EHttpHeaders,
	HttpHeadersWithBody,
	UploadedFile
} from '@core/types';
import {
	EmptyPayloadException,
	MissingHeaderException,
	PayloadTooLargeException
} from '@core/exceptions';

/**
 * @class ParseBodyMiddleware
 *
 * @typeParam S — Zod-схема тела запроса
 * @typeParam ModuleName — строковое имя модуля (для логгера)
 * @typeParam Ctx — входной тип контекста
 *
 * Результат парсинга: `z.infer<S>` → попадает в `ctx.body`.
 */
export class ParseBodyMiddleware extends BeforeMiddlewareModule<
	AnyHttpContext,
	{}
> {
	private readonly limit: number;
	/**
	 * @description
	 * Конструктор middleware для парсинга тела запроса.
	 */
	constructor(limit: number = 1024 * 1024) {
		super(ParseBodyMiddleware.name);
		this.limit = limit;
	}

	/**
	 * Выполняет парсинг тела запроса и передаёт управление дальше.
	 *
	 * @param ctx  Текущий HTTP-контекст
	 * @param next Продолжение конвейера
	 */
	public async handle(
		ctx: AnyHttpContext,
		next: (ctx: AnyHttpContext) => Promise<void>
	): Promise<void> {
		// Проверка что метод является POST, PUT, PATCH
		if (
			![EHttpMethod.POST, EHttpMethod.PUT, EHttpMethod.PATCH].includes(
				ctx.method
			)
		) {
			this.debug(
				{
					message: 'Body parsing: skip',
					requestId: ctx.requestId,
					details: { method: ctx.method }
				},
				{ log: { save: false } }
			);
			await next(ctx);
			return;
		}

		// ! ctx.headers is HttpHeadersWithBody
		const headers = ctx.headers as HttpHeadersWithBody;

		/**
		 * ? Проверка наличия длины тела
		 */

		const hasContentLength = Boolean(headers[EHttpHeaders.ContentLength]);
		const hasChunked = String(headers[EHttpHeaders.TransferEncoding] ?? '')
			.toLowerCase()
			.includes('chunked');

		// Проверка что установлены корректные заголовки для чтения тела запроса
		if (!hasContentLength && !hasChunked) {
			const err = new MissingHeaderException({
				message: 'Missing Content-Length or Transfer-Encoding: chunked',
				origin: this.getModuleName()
			});
			this.error(
				{
					message: 'Missing Content-Length or Transfer-Encoding: chunked',
					requestId: ctx.requestId,
					error: err
				},
				{ log: { save: false } }
			);
			throw err;
		}

		/**
		 * ? Чтение тела
		 */

		// Читаем тело запроса
		const chunks: Buffer[] = [];
		let size = 0;
		for await (const chunk of ctx.rawReq) {
			const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			size += buf.length;

			if (size > this.limit) {
				const err = new PayloadTooLargeException({
					message: 'Payload too large',
					origin: this.getModuleName()
				});
				this.error(
					{
						message: 'Payload too large',
						requestId: ctx.requestId,
						error: err
					},
					{ log: { save: false } }
				);
				throw err;
			}
			chunks.push(buf);
		}
		const raw = chunks.length ? Buffer.concat(chunks) : null;
		const contentType = headers[EHttpHeaders.ContentType];

		this.info({
			message: 'Request body read',
			details: {
				method: ctx.method,
				size,
				'content-type': contentType,
				'content-length': headers[EHttpHeaders.ContentLength] ?? null,
				'transfer-encoding': headers[EHttpHeaders.TransferEncoding] ?? null
			}
		});

		ctx.rawBody = raw;
		ctx.bodySize = size;

		// Проверка на пустой объект
		if (ctx.rawBody === null) {
			const error = new EmptyPayloadException({
				message: 'Empty raw body',
				origin: this.getModuleName()
			});

			this.error(
				{
					message: 'Empty body of request',
					requestId: ctx.requestId,
					error: error
				},
				{ log: { save: false } }
			);

			throw error;
		}

		/**
		 * ? Определение типа тела
		 */

		const ct = Array.isArray(contentType) ? contentType[0] : contentType ?? ''; // string | ''
		const base = ct.split(';')[0]?.trim().toLowerCase() || ''; // например 'application/json'
		const primary = base.split('/')[0] || ''; // 'application'
		const enc: BufferEncoding = ctx.charset;

		let parsed: any;

		switch (primary) {
			case 'application': {
				switch (base) {
					case 'application/json':
					case 'application/ld+json':
					case 'application/problem+json':
					case 'application/json-patch+json':
					case 'application/vnd.api+json': {
						const text = ctx.rawBody.toString(enc);
						try {
							parsed = text.length ? JSON.parse(text) : null;
						} catch (e) {
							// здесь можно кинуть InvalidPayload/InvalidJson
							throw new EmptyPayloadException({
								message: 'Invalid JSON body',
								origin: this.getModuleName()
							});
						}
						break;
					}

					case 'application/x-www-form-urlencoded': {
						const text = ctx.rawBody.toString(enc);
						const params = new URLSearchParams(text);
						parsed = Object.fromEntries(params.entries());
						break;
					}

					// бинарные/документы — оставляем как Buffer
					case 'application/octet-stream':
					case 'application/pdf':
					case 'application/zip':
					case 'application/xml':
					case 'application/javascript':
					default: {
						parsed = ctx.rawBody; // оставляем буфер
						break;
					}
				}
				break;
			}

			case 'text': {
				parsed = ctx.rawBody.toString(enc);
				break;
			}

			// остальные типы — оставляем буфер
			case 'image':
			case 'audio':
			case 'video':
			case 'message':
			case 'model': {
				parsed = ctx.rawBody;
				break;
			}

			case 'multipart': {
				const boundary = this.getBoundary(ct);
				if (!boundary) {
					throw new EmptyPayloadException({
						message: 'Missing boundary in Content-Type for multipart/form-data',
						origin: this.getModuleName()
					});
				}
				parsed = this.parseMultipartFormData(ctx.rawBody, boundary, enc);
				break;
			}

			default: {
				// неизвестно — по умолчанию Buffer
				parsed = ctx.rawBody;
				break;
			}
		}

		this.debug(
			{
				message: 'Content Type',
				requestId: ctx.requestId,
				details: { ctype: contentType }
			},
			{ log: { save: false } }
		);

		// Устанавливаем данные в ctx.body
		ctx.body = parsed;

		this.debug(
			{
				message: 'Body parsing: ok',
				requestId: ctx.requestId,
				details: {
					baseContentType: base || null,
					primaryType: primary || null,
					parsedType:
						parsed === null
							? 'null'
							: Buffer.isBuffer(parsed)
							? 'buffer'
							: typeof parsed
				}
			},
			{ log: { save: false } }
		);

		await next(ctx);
	}

	/**
	 *  Извлечение границы для multipart/form-data
	 */
	private getBoundary(contentType: string): string | null {
		const match = /boundary=(?<boundary>[^;]+)/i.exec(contentType);
		return match?.groups?.boundary || null;
	}

	/**
	 *  Парсинг multipart/form-data
	 */
	private parseMultipartFormData(
		buffer: Buffer,
		boundary: string,
		encoding: BufferEncoding
	): Record<string, any> {
		const result: Record<string, any> = {
			files: []
		};
		const parts = buffer.toString(encoding).split(`--${boundary}`);

		for (let i = 1; i < parts.length - 1; i++) {
			const part = parts[i];
			const headersEnd = part!.indexOf('\r\n\r\n');
			if (headersEnd === -1) continue;

			const rawHeaders = part!.substring(0, headersEnd);
			const body = part!.substring(headersEnd + 4);

			const headers: Record<string, string> = {};
			rawHeaders.split('\r\n').forEach(header => {
				const separatorIndex = header.indexOf(':');
				if (separatorIndex > -1) {
					const name = header.substring(0, separatorIndex).trim().toLowerCase();
					const value = header.substring(separatorIndex + 1).trim();
					headers[name] = value;
				}
			});

			const contentDisposition = headers[EHttpHeaders.ContentDisposition];
			if (contentDisposition) {
				const nameMatch = /name="(?<name>[^"]+)"/.exec(contentDisposition);
				const name = nameMatch?.groups?.name;

				if (name) {
					const filenameMatch = /filename="(?<filename>[^"]+)"/.exec(
						contentDisposition
					);
					const filename = filenameMatch?.groups?.filename;

					if (filename) {
						// Это файл
						const contentType = headers[EHttpHeaders.ContentType];
						const file: UploadedFile = {
							filename,
							mimetype: contentType!,
							size: body.length,
							encoding,
							buffer: Buffer.from(body.trim(), encoding) // Сохраняем как Buffer
						};
						result.files.push(file);
					} else {
						// Это обычное поле формы
						result[name] = body.trim();
					}
				}
			}
		}

		return result;
	}
}
