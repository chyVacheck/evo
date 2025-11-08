/**
 * @file StateConflict.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос конфликтует с текущим состоянием сервера.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос конфликтует с текущим состоянием сервера.
 */
export class StateConflictException extends AppException {
	constructor({
		message = `State Conflict`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.STATE_CONFLICT, origin, details, errors);
	}
}
