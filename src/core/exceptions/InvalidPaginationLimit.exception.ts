/**
 * @file InvalidPaginationLimit.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда параметр limit некорректен (например, меньше 1).
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Некорректное значение параметра limit (например, меньше 1)
 */
export class InvalidPaginationLimitException extends AppException {
	constructor({
		message = `Invalid pagination limit`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INVALID_PAGINATION_LIMIT, origin, details, errors);
	}
}
