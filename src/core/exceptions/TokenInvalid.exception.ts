/**
 * @file TokenInvalid.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда токен имеет неправильный формат.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда токен имеет неправильный формат.
 */
export class TokenInvalidException extends AppException {
	constructor({
		message = `Token invalid`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.TOKEN_INVALID, origin, details, null);
	}
}
