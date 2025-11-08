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
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда метод не реализован.
 */
export class NotImplementedException extends AppException {
	constructor({
		message = `Not Implemented`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.NOT_IMPLEMENTED, origin, details, errors);
	}
}
