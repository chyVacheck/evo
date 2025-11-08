/**
 * @file UnsupportedFileType.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда тип файла не поддерживается.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда тип файла недопустим.
 * @example application/json вместо image/png.
 */
export class UnsupportedFileTypeException extends AppException {
	constructor({
		message = `Unsupported File Type`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.UNSUPPORTED_FILE_TYPE, origin, details, errors);
	}
}
