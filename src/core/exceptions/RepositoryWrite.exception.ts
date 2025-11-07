/**
 * @file RepositoryWrite.exception.ts
 * @module core/exceptions
 *
 * @description
 * Исключение, которое выбрасывается, когда операция записи в репозиторий не была подтверждена.
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
export class RepositoryWriteException extends AppException {
	constructor({
		message = `Repository write operation not acknowledged`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(
			message,
			ErrorCode.REPOSITORY_WRITE_NOT_ACKNOWLEDGED,
			origin,
			details,
			errors
		);
	}
}
