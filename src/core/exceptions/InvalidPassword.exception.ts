/**
 * @file InvalidPassword.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда пароль неверный.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда пароль неверный.
 */
export class InvalidPasswordException extends AppException {
	constructor({
		message = `Invalid password`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INVALID_PASSWORD, origin, details, errors);
	}
}
