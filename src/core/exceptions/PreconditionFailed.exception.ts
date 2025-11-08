/**
 * @file PreconditionFailed.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда предварительное условие не выполнено.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда предварительное условие не выполнено.
 */
export class PreconditionFailedException extends AppException {
	constructor({
		message = `Precondition Failed`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.PRECONDITION_FAILED, origin, details, errors);
	}
}
