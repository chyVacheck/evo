/**
 * @file ValidateBody.middleware.ts
 * @module core/middleware
 *
 * @description
 * Валидирует тело запроса и добавляет его в `ctx.validate.body`.
 * Для использования этого миддлвар, нужно добавить его в пайплайн используя метод `useBefore` перед обработкой запроса.
 *
 * @typeParam S — Zod-схема тела запроса
 *
 * Подключать через `useBefore()` на нужных роутерах, чтобы не валидировать тело запроса глобально.
 *
 *  @example
 * ```ts
 * const BodySchema = z.object({ email: z.email(), password: z.string().min(8).max(32) });
 * router.useBefore(new ValidateBodyMiddleware(BodySchema))
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
import { AnyHttpContext, MergeState } from '@core/types';
import { EmptyPayloadException, InvalidBodyException } from '@core/exceptions';

/**
 * @description
 * Срез состояния, который добавляет данная middleware.
 *
 * @typeParam P — Тип валидированных параметров, полученных из Zod-схемы
 */
export type ValidatedBodyState<P> = {
	validated: {
		body: P;
	};
};

/**
 * @class ValidateBodyMiddleware
 *
 * @typeParam S — Zod-схема тела запроса
 * @typeParam ModuleName — строковое имя модуля (для логгера)
 * @typeParam Ctx — входной тип контекста
 *
 * Результат парсинга: `z.infer<S>` → попадает в `ctx.state.validated.body`.
 */
export class ValidateBodyMiddleware<
	S extends z.ZodObject<any>,
	Context extends AnyHttpContext = AnyHttpContext
> extends BeforeMiddlewareModule<Context, ValidatedBodyState<z.infer<S>>> {
	private readonly schema: S;

	/**
	 * @description
	 * Конструктор middleware для валидации тела запроса.
	 *
	 * @param schema Zod-схема для валидации тела запроса
	 */
	constructor(schema: S) {
		super(ValidateBodyMiddleware.name);

		this.schema = schema;
	}

	/**
	 * Выполняет валидацию тела запроса и передаёт управление дальше.
	 *
	 * @param ctx  Текущий HTTP-контекст
	 * @param next Продолжение конвейера
	 */
	public async handle(
		ctx: Context,
		next: (
			ctx: MergeState<Context, ValidatedBodyState<z.infer<S>>>
		) => Promise<void>
	): Promise<void> {
		this.debug(
			{
				message: 'Body validation: start',
				requestId: ctx.requestId,
				details: { raw: ctx.body, headers: ctx.headers }
			},
			{ log: { save: false } }
		);

		// Попытка парсинга тела запроса
		const parsed = this.schema.safeParse(ctx.body);

		// Если валидация не прошла, кидаем исключение
		if (!parsed.success) {
			// Плоская схема → ошибки лежат на верхнем уровне дерева
			const tree = z.treeifyError(parsed.error);
			const properties: Record<string, any> = tree.properties || {};
			const fieldErrors: Record<string, string[]> = {};

			for (const [key, node] of Object.entries(properties)) {
				const errs: string[] = [];
				if (Array.isArray((node as any).errors))
					errs.push(...(node as any).errors);
				if (Array.isArray((node as any).formErrors))
					errs.push(...(node as any).formErrors);
				if (errs.length) fieldErrors[key] = errs;
			}

			// Логируем ошибку и кидаем исключение
			const error = new InvalidBodyException({
				message: 'Invalid body',
				origin: this.getModuleName(),
				details: { body: ctx.body },
				errors: fieldErrors
			});

			this.error(
				{
					message: 'Invalid body',
					requestId: ctx.requestId,
					error: error
				},
				{ log: { save: false } }
			);

			throw error;
		}

		const validated = parsed.data;

		// Аккуратно мержим в state.validated, не затирая другие секции (query/body)
		const nextCtx: MergeState<Context, ValidatedBodyState<z.infer<S>>> = {
			...ctx,
			state: {
				...ctx.state,
				validated: {
					...ctx.state.validated,
					body: validated
				}
			}
		};

		this.debug(
			{
				message: 'Body validation: ok',
				requestId: ctx.requestId,
				details: { keys: Object.keys(validated ?? {}) }
			},
			{ log: { save: false } }
		);

		await next(nextCtx);
	}
}
