/**
 * @file IpNotAllowed.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда IP-адрес не разрешен.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда IP-адрес не разрешен.
 */
export class IpNotAllowedException extends AppException {
	constructor({
		message = `IP not allowed`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.IP_NOT_ALLOWED, origin, details, null);
	}
}