/**
 * @file UnsupportedMediaType.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда тип носителя не поддерживается.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда тип носителя не поддерживается сервером.
 * @example application/xml вместо application/json
 */
export class UnsupportedMediaTypeException extends AppException {
	constructor({
		message = `Unsupported Media Type`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.UNSUPPORTED_MEDIA_TYPE, origin, details, errors);
	}
}
