/**
 * @file Configuration.error.ts
 * @module core/errors
 *
 * @description
 * Ошибка конфигурации модуля.
 * Используется, когда модуль используется до его конфигурации.
 */

/**
 * ! my imports
 */
import { BaseError } from '@core/errors/Base.error';
import { ErrorConstructor } from '@core/types';

/**
 * @class ConfigurationError
 * @extends BaseError
 * @description
 * Ошибка конфигурации модуля.
 * Используется, когда модуль используется до его конфигурации.
 */
export class ConfigurationError extends BaseError {
	constructor({
		message = 'Module used before configuration',
		origin,
		fatal = true
	}: ErrorConstructor) {
		super({ message, origin, fatal });
	}
}
