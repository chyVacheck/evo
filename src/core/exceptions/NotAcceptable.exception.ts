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
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда клиент не может принять формат ответа.
 */
export class NotAcceptableException extends AppException {
	constructor({
		message = `Not Acceptable`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.NOT_ACCEPTABLE, origin, details, errors);
	}
}
