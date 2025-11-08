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
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда токен отсутствует.
 */
export class TokenMissingException extends AppException {
	constructor({
		message = `Token Missing`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.TOKEN_MISSING, origin, details, errors);
	}
}
