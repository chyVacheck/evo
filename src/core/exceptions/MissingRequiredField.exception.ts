/**
 * @file MissingRequiredField.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда отсутствует обязательное поле.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда отсутствует обязательное поле.
 */
export class MissingRequiredFieldException extends AppException {
	constructor({
		message = `Missing Required Field`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.MISSING_REQUIRED_FIELD, origin, details, errors);
	}
}
