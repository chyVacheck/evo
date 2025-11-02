/**
 * @file TokenExpired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда токен истек.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда токен истек.
 */
export class TokenExpiredException extends AppException {
	constructor({
		message = `Token expired`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.TOKEN_EXPIRED, origin, details, null);
	}
}
