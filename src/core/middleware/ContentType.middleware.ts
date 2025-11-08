/**
 * @file ContentType.middleware.ts
 * @module core/middleware
 *
 * @description
 * Проверяет Content-Type заголовок запроса.
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
	ContentType
} from '@core/types';
import {
	InvalidHeaderException,
	MissingHeaderException
} from '@core/exceptions';

/**
 * @class ContentTypeMiddleware
 * @typeParam Ctx — входной тип контекста
 */
export class ContentTypeMiddleware extends BeforeMiddlewareModule<
	AnyHttpContext,
	{}
> {
	/**
	 * @description
	 * Конструктор middleware для проверки Content-Type заголовка.
	 */
	constructor() {
		super(ContentTypeMiddleware.name);
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
					message: 'Content-Type parsing: skip',
					requestId: ctx.requestId,
					details: { method: ctx.method }
				},
				{ log: { save: false } }
			);
			await next(ctx);
			return;
		}

		const contentType = ctx.headers[EHttpHeaders.ContentType];

		// Проверка что Content-Type установлен
		if (!contentType) {
			const err = new MissingHeaderException({
				message: 'Content-Type header is missing',
				origin: this.getModuleName()
			});
			this.error(
				{
					message: 'Content-Type header is missing',
					requestId: ctx.requestId,
					error: err
				},
				{ log: { save: false } }
			);
			throw err;
		}

		// Проверка что Content-Type является строкой
		if (typeof contentType !== 'string') {
			const err = new InvalidHeaderException({
				message: 'Content-Type header is invalid',
				origin: this.getModuleName()
			});
			this.error(
				{
					message: 'Content-Type is invalid',
					requestId: ctx.requestId,
					error: err
				},
				{ log: { save: false } }
			);
			await next(ctx);
			return;
		}

		// Проверка что Content-Type является корректным типом
		if (!isContentType(contentType)) {
			const err = new InvalidHeaderException({
				message: 'Content-Type header is unknown',
				origin: this.getModuleName(),
				details: { ctype: contentType }
			});
			this.error(
				{
					message: 'Content-Type is unknown',
					requestId: ctx.requestId,
					error: err
				},
				{ log: { save: false } }
			);
			await next(ctx);
			return;
		}

		ctx.headers[EHttpHeaders.ContentType] = contentType;

		this.debug(
			{
				message: 'Content-Type parsing: ok',
				requestId: ctx.requestId,
				details: { ctype: contentType }
			},
			{ log: { save: false } }
		);

		await next(ctx);
	}
}

// Соберём известные типы
const KNOWN_CONTENT_TYPES = new Set<string>([
	// Application
	'application/json',
	'application/ld+json',
	'application/problem+json',
	'application/json-patch+json',
	'application/x-www-form-urlencoded',
	'application/javascript',
	'application/xml',
	'application/pdf',
	'application/graphql',
	'application/vnd.api+json',
	'application/octet-stream',
	'application/zip',

	// Text
	'text/plain',
	'text/javascript',
	'text/html',
	'text/css',
	'text/csv',
	'text/markdown',
	'text/xml',

	// Image
	'image/png',
	'image/jpeg',
	'image/gif',
	'image/svg+xml',
	'image/webp',
	'image/avif',
	'image/bmp',
	'image/x-icon',

	// Audio
	'audio/mpeg',
	'audio/aac',
	'audio/ogg',
	'audio/wav',
	'audio/webm',
	'audio/flac',

	// Video
	'video/mp4',
	'video/webm',
	'video/quicktime',
	'video/x-matroska',

	// Multipart
	'multipart/form-data'
]);

/**
 * Проверяет, что значение является корректным Content-Type.
 */
export function isContentType(value: string): value is ContentType {
	// Базовая форма: type/subtype
	const basePattern = /^[\w!#$&^.+-]+\/[\w!#$&^.+-]+/;
	if (!basePattern.test(value)) return false;

	// Если параметров нет — проверим по списку
	if (!value.includes(';')) {
		return KNOWN_CONTENT_TYPES.has(value);
	}

	// С параметрами (например application/json; charset=utf-8)
	const [base, ...params] = value.split(';').map(p => p.trim());
	if (!basePattern.test(base!)) return false;

	// если base известен или хотя бы валиден по паттерну — ок
	return KNOWN_CONTENT_TYPES.has(base!) || !!basePattern.test(base!);
}
