/**
 * @file UnknownProperty.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда свойство не известно.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда свойство не известно.
 */
export class UnknownPropertyException extends AppException {
	constructor({
		message = `Unknown property`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.UNKNOWN_PROPERTY, origin, details, errors);
	}
}
