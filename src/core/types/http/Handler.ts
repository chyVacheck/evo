/**
 * @file Handler.ts
 * @module core/types/http
 * @description Тип обработчика запроса
 */

/**
 * ! my imports
 */
import { AnyHttpContext } from '@core/types/http/context';

/**
 * @description Тип обработчика запроса
 */
export type HttpHandler<C extends AnyHttpContext = AnyHttpContext> = (
	ctx: C
) => void | Promise<void>;
