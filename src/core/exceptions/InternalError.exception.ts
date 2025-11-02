/**
 * @file InternalError.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда произошла внутренняя ошибка сервера.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда произошла внутренняя ошибка сервера.
 */
export class InternalErrorException extends AppException {
	constructor({
		message = `Internal server error`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.INTERNAL_ERROR, origin, details, null);
	}
}
