/**
 * @file UriTooLong.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда URI слишком длинный.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда URI слишком длинный.
 */
export class UriTooLongException extends AppException {
	constructor({
		message = `URI Too Long`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.URI_TOO_LONG, origin, details, errors);
	}
}
