/**
 * @file BadGateway.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда шлюз получил недействительный ответ.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда шлюз получил недействительный ответ.
 */
export class BadGatewayException extends AppException {
	constructor({
		message = `Bad Gateway`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.BAD_GATEWAY, origin, details, errors);
	}
}
