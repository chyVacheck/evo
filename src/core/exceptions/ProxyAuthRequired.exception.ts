/**
 * @file ProxyAuthRequired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда требуется аутентификация через прокси-сервер.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда требуется аутентификация через прокси-сервер.
 */
export class ProxyAuthRequiredException extends AppException {
	constructor({
		message = `Proxy Authentication Required`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.PROXY_AUTH_REQUIRED, origin, details, null);
	}
}