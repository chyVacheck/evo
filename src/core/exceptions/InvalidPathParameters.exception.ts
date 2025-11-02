/**
 * @file InvalidPathParameters.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда параметры пути недействительны.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда параметры пути недействительны.
 */
export class InvalidPathParametersException extends AppException {
	constructor({
		message = `Invalid Path Parameters`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.INVALID_PATH_PARAMETERS, origin, details, null);
	}
}