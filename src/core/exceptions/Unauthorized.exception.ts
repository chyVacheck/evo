/**
 * @file Unauthorized.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос требует аутентификации.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос требует аутентификации.
 */
export class UnauthorizedException extends AppException {
	constructor({
		message = `Unauthorized`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.UNAUTHORIZED, origin, details, errors);
	}
}
