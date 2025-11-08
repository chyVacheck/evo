/**
 * @file Gone.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда ресурс больше недоступен.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда ресурс больше недоступен.
 */
export class GoneException extends AppException {
	constructor({
		message = `Gone`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.GONE, origin, details, errors);
	}
}
