/**
 * @file Locked.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда ресурс заблокирован.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда ресурс заблокирован.
 */
export class LockedException extends AppException {
	constructor({
		message = `Locked`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.LOCKED, origin, details, errors);
	}
}
