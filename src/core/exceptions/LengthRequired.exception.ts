/**
 * @file LengthRequired.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда требуется заголовок Content-Length.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда требуется заголовок Content-Length.
 */
export class LengthRequiredException extends AppException {
	constructor({
		message = `Length Required`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.LENGTH_REQUIRED, origin, details, null);
	}
}