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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда размер файла превышает допустимый лимит.
 */
export class FileSizeExceededException extends AppException {
	constructor({
		message = `File Size Exceeded`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.FILE_SIZE_EXCEEDED, origin, details, null);
	}
}