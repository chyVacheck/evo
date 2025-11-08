/**
 * @file Dependency.error.ts
 * @module core/errors
 *
 * @description
 * Ошибка зависимости модуля.
 * Используется, когда модуль зависит от другого модуля, который не был конфигурирован.
 */

/**
 * ! my imports
 */
import { BaseError } from '@core/errors/Base.error';
import { ErrorConstructor } from '@core/types';

/**
 * @class DependencyError
 * @extends BaseError
 * @description
 * Ошибка зависимости модуля.
 * Используется, когда модуль зависит от другого модуля, который не был конфигурирован.
 */
export class DependencyError extends BaseError {
	constructor({
		message = 'Missing or invalid dependency',
		origin,
		fatal
	}: ErrorConstructor) {
		super({ message, origin, fatal });
	}
}
