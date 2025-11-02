/**
 * @file ExpectationFailed.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда ожидание не выполнено.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда ожидание не выполнено.
 */
export class ExpectationFailedException extends AppException {
	constructor({
		message = `Expectation Failed`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.EXPECTATION_FAILED, origin, details, null);
	}
}