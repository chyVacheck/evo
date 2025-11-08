/**
 * @file JsonParseError.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда произошла ошибка парсинга JSON.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда произошла ошибка парсинга JSON.
 */
export class JsonParseErrorException extends AppException {
	constructor({
		message = `JSON parse error`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.JSON_PARSE_ERROR, origin, details, errors);
	}
}
