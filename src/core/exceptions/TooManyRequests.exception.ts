/**
 * @file TooManyRequests.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда слишком много запросов.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда слишком много запросов.
 */
export class TooManyRequestsException extends AppException {
	constructor({
		message = `Too Many Requests`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.TOO_MANY_REQUESTS, origin, details, errors);
	}
}
