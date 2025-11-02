/**
 * @file NotAcceptable.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда клиент не может принять формат ответа.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда клиент не может принять формат ответа.
 */
export class NotAcceptableException extends AppException {
	constructor({
		message = `Not Acceptable`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.NOT_ACCEPTABLE, origin, details, null);
	}
}