/**
 * @file RequestHeaderFieldsTooLarge.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда поля заголовка запроса слишком велики.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда поля заголовка запроса слишком велики.
 */
export class RequestHeaderFieldsTooLargeException extends AppException {
	constructor({
		message = `Request Header Fields Too Large`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.REQUEST_HEADER_FIELDS_TOO_LARGE, origin, details, null);
	}
}