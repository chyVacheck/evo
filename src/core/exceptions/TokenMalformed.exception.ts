/**
 * @file TokenMalformed.exception.ts
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
export class TokenMalformedException extends AppException {
	constructor({
		message = `Token malformed`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.TOKEN_MALFORMED, origin, details, errors);
	}
}
