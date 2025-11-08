/**
 * @file EntityNotFound.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс не найден.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс не найден.
 */
export class EntityNotFoundException extends AppException {
	constructor({
		message = `Entity not found`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.ENTITY_NOT_FOUND, origin, details, errors);
	}
}
