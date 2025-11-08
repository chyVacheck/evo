/**
 * @file RouteConflictError.ts
 * @module core/errors
 *
 * @description
 * Ошибка возникает при попытке зарегистрировать маршрут,
 * который уже существует (тот же URL и HTTP-метод).
 */

/**
 * ! my imports
 */
import { BaseError } from '@core/errors/Base.error';
import { ErrorConstructor, HttpMethod } from '@core/types';

/**
 * @class RouteConflictError
 * @extends BaseError
 * @description
 * Ошибка возникает при попытке зарегистрировать маршрут,
 * который уже существует (тот же URL и HTTP-метод).
 */
export class RouteConflictError extends BaseError {
	constructor({
		method,
		origin,
		path,
		fatal = true
	}: Omit<ErrorConstructor, 'message'> & {
		method: HttpMethod;
		path: string;
	}) {
		super({
			message: `Route conflict detected: [${method}] ${path} already has a handler`,
			origin,
			fatal
		});
	}
}
