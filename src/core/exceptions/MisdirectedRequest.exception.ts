/**
 * @file MisdirectedRequest.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда запрос направлен на сервер, который не может обработать его.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда запрос направлен на сервер, который не может обработать его.
 */
export class MisdirectedRequestException extends AppException {
	constructor({
		message = `Misdirected Request`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.MISDIRECTED_REQUEST, origin, details, errors);
	}
}
