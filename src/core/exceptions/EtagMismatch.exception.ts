/**
 * @file EtagMismatch.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда Etag не соответствует.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда Etag не соответствует.
 */
export class EtagMismatchException extends AppException {
	constructor({
		message = `Etag Mismatch`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.ETAG_MISMATCH, origin, details, errors);
	}
}
