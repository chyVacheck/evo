/**
 * @file InsufficientStorage.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда недостаточно места для хранения.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда недостаточно места для хранения.
 */
export class InsufficientStorageException extends AppException {
	constructor({
		message = `Insufficient Storage`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INSUFFICIENT_STORAGE, origin, details, errors);
	}
}
