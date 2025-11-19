/**
 * @file InvalidParams.error.ts
 * @module core/errors
 *
 * @description
 * Ошибка некорректных параметров.
 * Используется, когда передаются некорректные параметры.
 */

/**
 * ! my imports
 */
import { BaseError } from '@core/errors/Base.error';
import { ErrorConstructor } from '@core/types';

/**
 * @class InvalidParamsError
 * @extends BaseError
 * @description
 * Ошибка некорректных параметров.
 * Используется, когда передаются некорректные параметры.
 */
export class InvalidParamsError extends BaseError {
	constructor({
		message = 'Invalid params',
		origin,
		fatal = true
	}: ErrorConstructor) {
		super({ message, origin, fatal });
	}
}
