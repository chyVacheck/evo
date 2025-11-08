/**
 * @file EmptyPayload.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда полезная нагрузка пуста.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда полезная нагрузка пуста.
 */
export class EmptyPayloadException extends AppException {
	constructor({
		message = `Payload is empty`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.EMPTY_PAYLOAD, origin, details, errors);
	}
}
