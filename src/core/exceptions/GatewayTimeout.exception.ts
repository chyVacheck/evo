/**
 * @file GatewayTimeout.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда шлюз не получил ответ вовремя.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда шлюз не получил ответ вовремя.
 */
export class GatewayTimeoutException extends AppException {
	constructor({
		message = `Gateway Timeout`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.GATEWAY_TIMEOUT, origin, details, errors);
	}
}
