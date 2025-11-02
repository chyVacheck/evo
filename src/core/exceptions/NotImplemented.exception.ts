/**
 * @file NotImplemented.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда метод не реализован.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда метод не реализован.
 */
export class NotImplementedException extends AppException {
	constructor({
		message = `Not Implemented`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.NOT_IMPLEMENTED, origin, details, null);
	}
}