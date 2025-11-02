/**
 * @file RequestTimeout.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда время ожидания запроса истекло.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда время ожидания запроса истекло.
 */
export class RequestTimeoutException extends AppException {
	constructor({
		message = `Request Timeout`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.REQUEST_TIMEOUT, origin, details, null);
	}
}