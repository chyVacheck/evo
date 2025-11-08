/**
 * @file AccessDenied.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос был отклонен сервером.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос был отклонен сервером.
 */
export class AccessDeniedException extends AppException {
	constructor({
		message = `Access denied`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.ACCESS_DENIED, origin, details, errors);
	}
}
