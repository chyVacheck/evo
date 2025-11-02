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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос не может быть выполнен из-за сбоя внешней зависимости.
 */
export class FailedDependencyException extends AppException {
	constructor({
		message = `Failed Dependency`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.FAILED_DEPENDENCY, origin, details, null);
	}
}