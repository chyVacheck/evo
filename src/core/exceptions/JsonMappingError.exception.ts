/**
 * @file JsonMappingError.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда произошла ошибка сопоставления JSON с моделью.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда произошла ошибка сопоставления JSON с моделью.
 */
export class JsonMappingErrorException extends AppException {
	constructor({
		message = `JSON mapping error`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.JSON_MAPPING_ERROR, origin, details, errors);
	}
}
