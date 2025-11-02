/**
 * @file RoleRequired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос требует наличия определенной роли.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос требует наличия определенной роли.
 */
export class RoleRequiredException extends AppException {
	constructor({
		message = `Role required`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.ROLE_REQUIRED, origin, details, null);
	}
}
