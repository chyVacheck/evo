/**
 * @file InvalidHeader.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда `header` запроса является некорректным.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда `header` запроса является некорректным.
 */
export class InvalidHeaderException extends AppException {
	constructor({
		message = `Invalid header`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.INVALID_HEADER, origin, details, null);
	}
}
