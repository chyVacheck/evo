/**
 * @file PaymentRequired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда требуется оплата для доступа к ресурсу.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда требуется оплата для доступа к ресурсу.
 */
export class PaymentRequiredException extends AppException {
	constructor({
		message = `Payment Required`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.PAYMENT_REQUIRED, origin, details, null);
	}
}