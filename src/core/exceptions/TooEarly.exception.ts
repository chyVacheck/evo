/**
 * @file TooEarly.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос был отправлен слишком рано.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос был отправлен слишком рано.
 */
export class TooEarlyException extends AppException {
	constructor({
		message = `Too Early`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.TOO_EARLY, origin, details, null);
	}
}