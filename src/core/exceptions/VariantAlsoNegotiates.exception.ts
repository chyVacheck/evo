/**
 * @file VariantAlsoNegotiates.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда вариант также согласовывает.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда вариант также согласовывает.
 */
export class VariantAlsoNegotiatesException extends AppException {
	constructor({
		message = `Variant Also Negotiates`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.VARIANT_ALSO_NEGOTIATES, origin, details, errors);
	}
}
