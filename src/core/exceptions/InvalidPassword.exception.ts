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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда пароль неверный.
 */
export class InvalidPasswordException extends AppException {
	constructor({
		message = `Invalid password`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.INVALID_PASSWORD, origin, details, null);
	}
}
