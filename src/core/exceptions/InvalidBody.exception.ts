/**
 * @file InvalidBody.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда тело запроса недействительно.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда тело запроса недействительно.
 */
export class InvalidBodyException extends AppException {
	constructor({
		message = `Invalid Body`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INVALID_BODY, origin, details, errors);
	}
}
