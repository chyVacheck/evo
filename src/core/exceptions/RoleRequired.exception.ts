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
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос требует наличия определенной роли.
 */
export class RoleRequiredException extends AppException {
	constructor({
		message = `Role required`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.ROLE_REQUIRED, origin, details, errors);
	}
}
