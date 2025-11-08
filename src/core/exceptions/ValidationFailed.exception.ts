/**
 * @file ValidationFailed.exception.ts
 * @module core/types
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, валидация данных не прошла.
 *
 * @author Dmytro Shakh
 */
export class ValidationFailedException extends AppException {
	constructor({
		message = 'Validation failed',
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.VALIDATION_FAILED, origin, details, errors);
	}
}
