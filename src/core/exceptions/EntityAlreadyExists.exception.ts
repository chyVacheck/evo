/**
 * @file EntityAlreadyExists.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс уже существует.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс уже существует.
 */
export class EntityAlreadyExistsException extends AppException {
	constructor({
		message = `Entity already exists`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.ENTITY_ALREADY_EXISTS, origin, details, errors);
	}
}
