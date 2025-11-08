/**
 * @file RateLimited.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда клиент превысил лимит запросов.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда клиент превысил лимит запросов.
 */
export class RateLimitedException extends AppException {
	constructor({
		message = `Rate Limited`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.RATE_LIMITED, origin, details, errors);
	}
}
