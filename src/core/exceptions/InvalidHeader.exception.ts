/**
 * @file InvalidHeader.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда `header` запроса является некорректным.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда `header` запроса является некорректным.
 */
export class InvalidHeaderException extends AppException {
	constructor({
		message = `Invalid header`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INVALID_HEADER, origin, details, errors);
	}
}
