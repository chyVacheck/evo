/**
 * @file ServiceUnavailable.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда служба недоступна.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда служба недоступна.
 */
export class ServiceUnavailableException extends AppException {
	constructor({
		message = `Service Unavailable`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.SERVICE_UNAVAILABLE, origin, details, errors);
	}
}
