/**
 * @file InvalidFieldValue.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда значение поля недопустимо.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда значение поля недопустимо.
 */
export class InvalidFieldValueException extends AppException {
	constructor({
		message = `Invalid Field Value`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INVALID_FIELD_VALUE, origin, details, errors);
	}
}
