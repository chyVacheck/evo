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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда Etag не соответствует.
 */
export class EtagMismatchException extends AppException {
	constructor({
		message = `Etag Mismatch`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.ETAG_MISMATCH, origin, details, null);
	}
}