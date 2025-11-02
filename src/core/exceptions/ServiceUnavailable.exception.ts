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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда служба недоступна.
 */
export class ServiceUnavailableException extends AppException {
	constructor({
		message = `Service Unavailable`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.SERVICE_UNAVAILABLE, origin, details, null);
	}
}