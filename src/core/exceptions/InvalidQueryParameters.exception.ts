/**
 * @file InvalidQueryParameters.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда параметры запроса неверны.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда параметры запроса неверны.
 */
export class InvalidQueryParametersException extends AppException {
	constructor({
		message = `Invalid query parameters`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INVALID_QUERY_PARAMETERS, origin, details, errors);
	}
}
