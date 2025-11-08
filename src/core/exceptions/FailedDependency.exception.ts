/**
 * @file FailedDependency.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос не может быть выполнен из-за сбоя внешней зависимости.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос не может быть выполнен из-за сбоя внешней зависимости.
 */
export class FailedDependencyException extends AppException {
	constructor({
		message = `Failed Dependency`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.FAILED_DEPENDENCY, origin, details, errors);
	}
}
