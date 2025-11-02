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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда область действия недостаточна.
 */
export class InsufficientScopeException extends AppException {
	constructor({
		message = `Insufficient Scope`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.INSUFFICIENT_SCOPE, origin, details, null);
	}
}