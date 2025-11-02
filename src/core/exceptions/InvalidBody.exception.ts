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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда тело запроса недействительно.
 */
export class InvalidBodyException extends AppException {
	constructor({
		message = `Invalid Body`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.INVALID_BODY, origin, details, null);
	}
}