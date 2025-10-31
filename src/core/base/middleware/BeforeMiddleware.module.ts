/**
 * @file BeforeMiddleware.module.ts
 * @module core/base
 *
 * @description Базовый класс для before-middleware (выполняются до контроллера).
 *
 * @see EModuleType
 *
 * @example
 * class SomeCustomMiddleware extends BeforeMiddlewareModule {
 *   constructor() {
 *     super(SomeCustomMiddleware.name);
 *   }
 *   abstract handle(ctx: Context, next: (ctx: MergeState<Context, StateAdd>) => Promise<void>): Promise<void> | void;
 * }
 */

/**
 * ! my imports
 */
import {
	AnyHttpContext,
	IBeforeMiddlewareModule,
	MergeState
} from '@core/types';
import { MiddlewareModule } from '@core/base/middleware/BaseMiddleware.module';

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class BeforeMiddlewareModule<
		ModuleName extends string = string,
		Context extends AnyHttpContext = AnyHttpContext,
		StateAdd extends object = {}
	>
	extends MiddlewareModule<ModuleName>
	implements IBeforeMiddlewareModule<ModuleName, Context, StateAdd>
{
	/**
	 * Базовый конструктор Middleware-модуля.
	 *
	 * @param moduleName - Название модуля
	 */
	protected constructor(moduleName: ModuleName) {
		super(moduleName);
	}

	/**
	 * Точка входа мидлвары.
	 * Обязана вызвать `next(updatedCtx)`; может расширять `ctx.state`.
	 */
	// abstract handle: BeforeMiddlewareAction<Context, StateAdd>;
	abstract handle(
		ctx: Context,
		next: (ctx: MergeState<Context, StateAdd>) => Promise<void>
	): Promise<void>;
}
