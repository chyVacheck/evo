/**
 * @file EntityNotDeleted.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс не удален.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс не удален.
 */
export class EntityNotDeletedException extends AppException {
	constructor({
		message = `Entity not deleted`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.ENTITY_NOT_DELETED, origin, details, errors);
	}
}
