/**
 * @file InvalidMimeType.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда MIME-тип файла недействителен.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда MIME-тип файла недействителен.
 */
export class InvalidMimeTypeException extends AppException {
	constructor({
		message = `Invalid MIME type`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.UNSUPPORTED_MEDIA_TYPE, origin, details, errors);
	}
}
