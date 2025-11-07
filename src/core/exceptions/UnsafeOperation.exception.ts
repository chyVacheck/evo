/**
 * @file UnsafeOperation.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда операция записи в репозиторий не была подтверждена.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда операция записи в репозиторий не была подтверждена.
 */
export class UnsafeOperationException extends AppException {
	constructor({
		message = `Unsafe operation`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.UNSAFE_OPERATION, origin, details, errors);
	}
}
