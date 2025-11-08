/**
 * @file PayloadTooLarge.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос слишком большой.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос слишком большой.
 */
export class PayloadTooLargeException extends AppException {
	constructor({
		message = `Payload too large`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.PAYLOAD_TOO_LARGE, origin, details, errors);
	}
}
