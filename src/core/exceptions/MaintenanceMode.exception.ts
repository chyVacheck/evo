/**
 * @file MaintenanceMode.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда сервис недоступен из-за режима обслуживания.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда сервис недоступен из-за режима обслуживания.
 */
export class MaintenanceModeException extends AppException {
	constructor({
		message = `Service Unavailable: Maintenance Mode`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.MAINTENANCE_MODE, origin, details, errors);
	}
}
