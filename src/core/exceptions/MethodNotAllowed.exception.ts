/**
 * @file MethodNotAllowed.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда используемый HTTP-метод не поддерживается ресурсом.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда используемый HTTP-метод не поддерживается ресурсом.
 */
export class MethodNotAllowedException extends AppException {
	constructor({
		message = `Method Not Allowed`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.METHOD_NOT_ALLOWED, origin, details, errors);
	}
}
