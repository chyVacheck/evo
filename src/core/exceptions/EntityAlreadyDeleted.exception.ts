/**
 * @file EntityAlreadyDeleted.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс уже удален.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрашиваемый ресурс уже удален.
 */
export class EntityAlreadyDeletedException extends AppException {
	constructor({
		message = `Entity already deleted`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.ENTITY_ALREADY_DELETED, origin, details, null);
	}
}
