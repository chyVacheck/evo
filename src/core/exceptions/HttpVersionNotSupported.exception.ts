/**
 * @file HttpVersionNotSupported.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда версия HTTP не поддерживается.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда версия HTTP не поддерживается.
 */
export class HttpVersionNotSupportedException extends AppException {
	constructor({
		message = `HTTP Version Not Supported`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(
			message,
			ErrorCode.HTTP_VERSION_NOT_SUPPORTED,
			origin,
			details,
			errors
		);
	}
}
