/**
 * @file Router.ts
 * @module core/types/http
 * @description
 * Интерфейс модуля роутера.
 */

/**
 * ! my imports
 */
import { HttpPath } from '@core/types/http/Common';
import { AnyHttpContext } from '@core/types/http/context';
import { ControllerAction } from '@core/types/http/Controller';

/**
 * @description
 * Сигнатура метода регистрации маршрута.
 */
export type RouteMethodRegistrar<Base extends AnyHttpContext, Ret = void> = (
	path: HttpPath,
	handler: ControllerAction<Base>
) => Ret;
