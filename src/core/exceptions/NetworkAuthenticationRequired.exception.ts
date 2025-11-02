/**
 * @file NetworkAuthenticationRequired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда для доступа к сети требуется аутентификация.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда для доступа к сети требуется аутентификация.
 */
export class NetworkAuthenticationRequiredException extends AppException {
	constructor({
		message = `Network Authentication Required`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.NETWORK_AUTHENTICATION_REQUIRED, origin, details, null);
	}
}