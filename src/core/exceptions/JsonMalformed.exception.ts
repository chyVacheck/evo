/**
 * @file JsonMalformed.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда JSON имеет некорректный формат.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда JSON имеет некорректный формат.
 */
export class JsonMalformedException extends AppException {
	constructor({
		message = `Malformed JSON`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.JSON_MALFORMED, origin, details, errors);
	}
}
