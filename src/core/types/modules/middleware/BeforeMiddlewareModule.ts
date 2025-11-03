/**
 * @file BeforeMiddlewareModule.ts
 * @module core/types/modules
 * @description Интерфейс before-middleware: выполняется ДО контроллера, может расширять ctx.state.
 */

/**
 * ! my imports
 */
import { IBaseModule } from '@core/types/modules/BaseModule';
import { BeforeMiddlewareAction, AnyHttpContext } from '@core/types/http';

/**
 * Интерфейс базового класса для before-middleware (выполняются до контроллера).
 */
export interface IBeforeMiddlewareModule<
	ModuleName extends string = string,
	Context extends AnyHttpContext = AnyHttpContext,
	StateAdd extends object = {}
> extends IBaseModule<ModuleName> {
	/**
	 * Исполняемая функция middleware.
	 * Выполняется с контекстом запроса и должна вызвать `next(ctx)` для передачи управления дальше.
	 * Может расширять состояние контекста (`ctx.state`).
	 */
	handle: BeforeMiddlewareAction<Context, StateAdd>;
}
