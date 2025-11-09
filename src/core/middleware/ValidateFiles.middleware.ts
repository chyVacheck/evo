/**
 * @file ValidateFiles.middleware.ts
 * @module core/middleware
 *
 * @description
 * Валидирует файлы запроса и добавляет их в `ctx.validate.files`.
 * Для использования этого миддлвар, нужно добавить его в пайплайн используя метод `useBefore` перед обработкой запроса.
 *
 * Подключать через `useBefore()` на нужных роутерах, чтобы не валидировать файлы запроса глобально.
 *
 *  @example
 * ```ts
 * const FilesSchema = z.object({
 * 	avatar: z.instanceof(UploadedFile),
 * 	cover: z.instanceof(UploadedFile),
 * });
 * router.useBefore(new ValidateFilesMiddleware(FilesSchema))
 * 		.post('/users', controller.create)
 * 		.done();
 * ```
 */

/**
 * ! lib imports
 */
import { z } from 'zod';

/**
 * ! my imports
 */
import { BeforeMiddlewareModule } from '@core/base';
import { AnyHttpContext, MergeState, UploadedFile } from '@core/types';
import {
	InvalidBodyException,
	InvalidMimeTypeException,
	PayloadTooLargeException
} from '@core/exceptions';

/**
 * @description
 * Срез состояния, который добавляет данная middleware.
 *
 * @typeParam P — Тип валидированных параметров, полученных из Zod-схемы
 */
export type ValidatedFilesState<P> = {
	validated: {
		files: P;
	};
};

/**
 * @class ValidateFilesMiddleware
 *
 * @typeParam S — Zod-схема файлов запроса
 * @typeParam ModuleName — строковое имя модуля (для логгера)
 * @typeParam Ctx — входной тип контекста
 *
 * Результат валидации: `z.infer<S>` → попадает в `ctx.state.validated.files`.
 */
export class ValidateFilesMiddleware<
	Context extends AnyHttpContext = AnyHttpContext
> extends BeforeMiddlewareModule<
	Context,
	ValidatedFilesState<Array<UploadedFile>>
> {
	private readonly maxSize: number;
	private readonly minCount: number;
	private readonly maxCount: number;
	private readonly allowedMimeTypes: Array<string>;

	/**
	 * @description
	 * Конструктор middleware для валидации файлов запроса.
	 *
	 * @param schema Zod-схема для валидации файлов запроса
	 */
	constructor(params?: {
		maxSize?: number;
		minCount?: number;
		maxCount?: number;
		allowedMimeTypes?: Array<string>;
	}) {
		super(ValidateFilesMiddleware.name);
		const {
			maxSize = 5 * 1024 * 1024,
			minCount = 1,
			maxCount = 5, // todo добавить глобальное ограничение на количество файлов с выбросом исключения например (InvalidBodyException)
			allowedMimeTypes = []
		} = params || {};

		this.maxSize = maxSize;
		this.minCount = minCount;
		this.maxCount = maxCount;
		this.allowedMimeTypes = allowedMimeTypes.map(type => type.toLowerCase());
	}

	/**
	 * Выполняет валидацию файлов запроса и передаёт управление дальше.
	 *
	 * @param ctx  Текущий HTTP-контекст
	 * @param next Продолжение конвейера
	 */
	public async handle(
		ctx: Context,
		next: (
			ctx: MergeState<Context, ValidatedFilesState<Array<UploadedFile>>>
		) => Promise<void>
	): Promise<void> {
		const files: Array<UploadedFile> = ctx.body.files;

		this.debug(
			{
				message: 'Files validation: start',
				requestId: ctx.requestId,
				details: { filesCount: files.length, headers: ctx.headers }
			},
			{ log: { save: false } }
		);

		// Проверка на минимальное количество файлов
		if (files.length < this.minCount) {
			const err = new InvalidBodyException({
				message: `Not enough files to validate. Min count is ${this.minCount}.`,
				origin: this.getModuleName()
			});
			this.error(
				{
					message: 'Files validation failed: not enough files',
					requestId: ctx.requestId,
					details: { minCount: this.minCount },
					error: err
				},
				{ log: { save: false } }
			);
			throw err;
		}

		// Проверка на максимальное количество файлов
		if (files.length > this.maxCount) {
			const err = new InvalidBodyException({
				message: `Too many files to validate. Max count is ${this.maxCount}.`,
				origin: this.getModuleName()
			});
			this.error(
				{
					message: 'Files validation failed: too many files',
					requestId: ctx.requestId,
					details: { maxCount: this.maxCount },
					error: err
				},
				{ log: { save: false } }
			);
			throw err;
		}

		// Валидация каждого файла
		for (const file of files) {
			// Валидация размера файла
			if (file.size > this.maxSize) {
				const err = new PayloadTooLargeException({
					message: `File ${file.filename} is too large. Max size is ${this.maxSize} bytes.`,
					origin: this.getModuleName()
				});
				this.error(
					{
						message: 'File validation failed: size limit exceeded',
						requestId: ctx.requestId,
						details: { maxSize: this.maxSize },
						error: err
					},
					{ log: { save: false } }
				);
				throw err;
			}

			// Валидация MIME-типа
			if (
				this.allowedMimeTypes.length > 0 &&
				file.mimetype &&
				!this.allowedMimeTypes.includes(file.mimetype.toLowerCase())
			) {
				const err = new InvalidMimeTypeException({
					message: `File ${file.filename} has an unsupported MIME type: ${
						file.mimetype
					}. Allowed types: ${this.allowedMimeTypes.join(', ')}.`,
					origin: this.getModuleName()
				});
				this.error(
					{
						message: 'File validation failed: unsupported MIME type',
						requestId: ctx.requestId,
						details: {
							fileMimeType: file.mimetype,
							allowedMimeTypes: this.allowedMimeTypes
						},
						error: err
					},
					{ log: { save: false } }
				);
				throw err;
			}
		}

		// Аккуратно мержим в state.validated, не затирая другие секции (query/body)
		const nextCtx: MergeState<
			Context,
			ValidatedFilesState<Array<UploadedFile>>
		> = {
			...ctx,
			state: {
				...ctx.state,
				validated: {
					...ctx.state.validated,
					files: files
				}
			}
		};

		this.debug(
			{
				message: 'Files validation: ok',
				requestId: ctx.requestId,
				details: { keys: Object.keys(files ?? {}) }
			},
			{ log: { save: false } }
		);

		await next(nextCtx);
	}
}
