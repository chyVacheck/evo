/**
 * @file FinallyMiddlewareModule.ts
 * @module core/types/modules
 * @description Интерфейс finally-middleware: выполняется ВСЕГДА (и при ошибках, и при раннем ответе).
 */

/**
 * ! my imports
 */
import { IBaseModule } from '@core/types/modules/BaseModule';
import { FinallyMiddlewareAction, AnyHttpContext } from '@core/types/http';

/**
 * Интерфейс модуля finally middleware.
 */
export interface IFinallyMiddlewareModule<
	Context extends AnyHttpContext = AnyHttpContext,
	ErrorType extends Error = Error
> extends IBaseModule {
	/**
	 * Исполняемая функция middleware.
	 * Выполняется с контекстом запроса.
	 */
	handle: FinallyMiddlewareAction<Context, ErrorType>;
}
