/**
 * @file Controller.ts
 * @module core/types/http
 * @description Тип метода контроллера
 */

/**
 * ! my imports
 */
import { AnyHttpContext } from '@core/types/http/context';
import { HttpHandler } from '@core/types/http/Handler';

export type ControllerAction<Ctx extends AnyHttpContext = AnyHttpContext> =
	HttpHandler<Ctx>;
