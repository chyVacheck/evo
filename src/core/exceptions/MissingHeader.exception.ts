/**
 * @file MissingHeader.exception.ts
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
 * Класс ошибки приложения, когда в `header` запроса отсутствует обязательный заголовок.
 */
export class MissingHeaderException extends AppException {
	constructor({
		message = `Missing header`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.MISSING_HEADER, origin, details, errors);
	}
}
