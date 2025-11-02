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
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда произошла ошибка парсинга JSON.
 */
export class JsonParseErrorException extends AppException {
	constructor({
		message = `JSON parse error`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.JSON_PARSE_ERROR, origin, details, null);
	}
}
