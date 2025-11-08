/**
 * @file InsufficientScope.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда область действия недостаточна.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда область действия недостаточна.
 */
export class InsufficientScopeException extends AppException {
	constructor({
		message = `Insufficient Scope`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.INSUFFICIENT_SCOPE, origin, details, errors);
	}
}
