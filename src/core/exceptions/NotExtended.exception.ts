/**
 * @file NotExtended.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос не может быть выполнен, потому что серверу требуется дальнейшее расширение запроса.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос не может быть выполнен, потому что серверу требуется дальнейшее расширение запроса.
 */
export class NotExtendedException extends AppException {
	constructor({
		message = `Not Extended`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.NOT_EXTENDED, origin, details, errors);
	}
}
