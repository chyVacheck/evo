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
		Context extends AnyHttpContext = AnyHttpContext,
		StateAdd extends object = {}
	>
	extends MiddlewareModule
	implements IBeforeMiddlewareModule<Context, StateAdd>
{
	/**
	 * Базовый конструктор Middleware-модуля.
	 *
	 * @param {string} moduleName - Название модуля
	 */
	protected constructor(moduleName: string) {
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
