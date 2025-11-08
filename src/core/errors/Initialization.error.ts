/**
 * @file Initialization.error.ts
 * @module core/errors
 *
 * @description
 * Ошибка инициализации модуля.
 * Используется, когда модуль используется до его инициализации.
 */

/**
 * ! my imports
 */
import { BaseError } from '@core/errors/Base.error';
import { ErrorConstructor } from '@core/types';

/**
 * @class InitializationError
 * @extends BaseError
 * @description
 * Ошибка инициализации модуля.
 * Используется, когда модуль используется до его инициализации.
 */
export class InitializationError extends BaseError {
	constructor({
		message = 'Module used before initialization',
		origin,
		fatal = true
	}: ErrorConstructor) {
		super({ message, origin, fatal });
	}
}
