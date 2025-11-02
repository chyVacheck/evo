/**
 * @file UnavailableForLegalReasons.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда ресурс недоступен по юридическим причинам.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда ресурс недоступен по юридическим причинам.
 */
export class UnavailableForLegalReasonsException extends AppException {
	constructor({
		message = `Unavailable For Legal Reasons`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.UNAVAILABLE_FOR_LEGAL_REASONS, origin, details, null);
	}
}