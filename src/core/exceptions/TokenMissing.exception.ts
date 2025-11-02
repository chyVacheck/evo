/**
 * @file TokenMissing.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда токен отсутствует.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда токен отсутствует.
 */
export class TokenMissingException extends AppException {
	constructor({
		message = `Token Missing`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.TOKEN_MISSING, origin, details, null);
	}
}