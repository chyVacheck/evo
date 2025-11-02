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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда сервис недоступен из-за режима обслуживания.
 */
export class MaintenanceModeException extends AppException {
	constructor({
		message = `Service Unavailable: Maintenance Mode`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.MAINTENANCE_MODE, origin, details, null);
	}
}