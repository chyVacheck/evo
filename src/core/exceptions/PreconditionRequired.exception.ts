/**
 * @file PreconditionRequired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос должен быть условным.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос должен быть условным.
 */
export class PreconditionRequiredException extends AppException {
	constructor({
		message = `Precondition Required`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.PRECONDITION_REQUIRED, origin, details, errors);
	}
}
