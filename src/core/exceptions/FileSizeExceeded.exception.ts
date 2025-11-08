/**
 * @file FileSizeExceeded.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда размер файла превышает допустимый лимит.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда размер файла превышает допустимый лимит.
 */
export class FileSizeExceededException extends AppException {
	constructor({
		message = `File Size Exceeded`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.FILE_SIZE_EXCEEDED, origin, details, errors);
	}
}
