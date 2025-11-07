/**
 * @file AfterMiddlewareModule.ts
 * @module core/types/modules
 * @description Интерфейс after-middleware: выполняется ПОСЛЕ контроллера (только если ошибок не было).
 */

/**
 * ! my imports
 */
import { IBaseModule } from '@core/types/modules/BaseModule';
import { AfterMiddlewareAction, AnyHttpContext } from '@core/types/http';

/**
 * Интерфейс модуля after middleware.
 */
export interface IAfterMiddlewareModule<
	Context extends AnyHttpContext = AnyHttpContext
> extends IBaseModule {
	/**
	 * Исполняемая функция middleware.
	 * Вызывается после основного контроллера.
	 * Может использовать контекст запроса, но не передаёт управление дальше.
	 */
	handle: AfterMiddlewareAction<Context>;
}
