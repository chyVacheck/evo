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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда параметры запроса неверны.
 */
export class InvalidQueryParametersException extends AppException {
	constructor({
		message = `Invalid query parameters`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.INVALID_QUERY_PARAMETERS, origin, details, null);
	}
}
