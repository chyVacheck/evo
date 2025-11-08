/**
 * @file UpgradeRequired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда требуется обновление.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда требуется обновление.
 */
export class UpgradeRequiredException extends AppException {
	constructor({
		message = `Upgrade Required`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.UPGRADE_REQUIRED, origin, details, errors);
	}
}
