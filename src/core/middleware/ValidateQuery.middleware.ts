/**
 * @file ValidateQuery.middleware.ts
 * @module core/middleware
 *
 * @description
 * Валидирует параметры запроса и добавляет их в `ctx.validate.params`.
 * Для использования этого миддлвар, нужно добавить его в пайплайн используя метод `useBefore` перед обработкой запроса.
 *
 * @typeParam S — Zod-схема параметров
 *
 * Подключать через `useBefore()` на нужных роутерах, чтобы не валидировать параметры глобально.
 *
 *  @example
 * ```ts
 * const ParamsSchema = z.object({ userId: z.string().uuid() });
 * router.useBefore(new ValidateParamsMiddleware(ParamsSchema))
 * 		.get('/users/:userId', controller.getOne)
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
import {
	InvalidPathParametersException,
	InvalidQueryParametersException
} from '@core/exceptions';

/**
 * @description
 * Срез состояния, который добавляет данная middleware.
 *
 * @typeParam P — Тип валидированных параметров, полученных из Zod-схемы
 */
export type ValidatedQueryState<P> = {
	validated: {
		query: P;
	};
};

const DISALLOWED_BASE = new Set(['object']);

/**
 * @class ValidateQueryMiddleware
 *
 * @typeParam S — Zod-схема параметров
 * @typeParam ModuleName — строковое имя модуля (для логгера)
 * @typeParam Ctx — входной тип контекста
 *
 * Результат парсинга: `z.infer<S>` → попадает в `ctx.state.validated.query`.
 */
export class ValidateQueryMiddleware<
	S extends z.ZodObject<any>,
	Context extends AnyHttpContext = AnyHttpContext
> extends BeforeMiddlewareModule<
	typeof ValidateQueryMiddleware.name,
	Context,
	ValidatedQueryState<z.infer<S>>
> {
	private readonly schema: S;

	private assertFlatObjectSchema(
		schema: z.ZodObject<any>
	): asserts schema is z.ZodObject<any> {
		const offenders: Record<string, string> = {};

		for (const [key, raw] of Object.entries(schema.shape)) {
			const typeName = (raw as any)?._def?.type;

			if (DISALLOWED_BASE.has(typeName)) {
				offenders[key] = typeName ?? 'Unknown';
			}
		}

		if (Object.keys(offenders).length) {
			const msg = Object.entries(offenders)
				.map(([key, type]) => `${key}: ${type}`)
				.join(', ');
			this.fatal(
				{
					message: `Schema must contains only flat (string/number/enum/literal) parameters. Offenders: ${msg}`,
					details: { offenders: offenders }
				},
				{ log: { save: false }, console: { prettyDetails: true } }
			);
			throw new Error(
				`Schema must contains only flat (string/number/enum/literal) parameters. Offenders: ${msg}`
			);
		}
	}

	/**
	 * @description
	 * Конструктор middleware для валидации параметров запроса.
	 *
	 * @param schema Zod-схема для валидации параметров
	 */
	constructor(schema: S) {
		super(ValidateQueryMiddleware.name);
		this.assertFlatObjectSchema(schema);
		this.schema = schema;
	}

	/**
	 * Выполняет валидацию параметров запроса и передаёт управление дальше.
	 *
	 * @param ctx  Текущий HTTP-контекст
	 * @param next Продолжение конвейера
	 */
	public async handle(
		ctx: Context,
		next: (
			ctx: MergeState<Context, ValidatedQueryState<z.infer<S>>>
		) => Promise<void>
	): Promise<void> {
		this.debug(
			{
				message: 'Query validation: start',
				requestId: ctx.requestId,
				details: { raw: ctx.query }
			},
			{ log: { save: false } }
		);

		const parsed = this.schema.safeParse(ctx.query);

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
			const error = new InvalidQueryParametersException({
				message: 'Invalid Query Parameters',
				origin: this.getModuleName(),
				details: { query: ctx.query },
				errors: fieldErrors
			});

			this.error(
				{
					message: 'Invalid Query Parameters',
					requestId: ctx.requestId,
					error: error
				},
				{ log: { save: false } }
			);

			throw error;
		}

		const validated = parsed.data;

		// Аккуратно мержим в state.validated, не затирая другие секции (query/body)
		const nextCtx: MergeState<Context, ValidatedQueryState<z.infer<S>>> = {
			...ctx,
			state: {
				...ctx.state,
				validated: {
					...ctx.state.validated,
					query: validated
				}
			}
		};

		this.debug(
			{
				message: 'Query validation: ok',
				requestId: ctx.requestId,
				details: { keys: Object.keys(validated ?? {}) }
			},
			{ log: { save: false } }
		);

		await next(nextCtx);
	}
}
