/**
 * @file EntityAlreadyDeleted.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс уже удален.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс уже удален.
 */
export class EntityAlreadyDeletedException extends AppException {
	constructor({
		message = `Entity already deleted`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.ENTITY_ALREADY_DELETED, origin, details, errors);
	}
}
