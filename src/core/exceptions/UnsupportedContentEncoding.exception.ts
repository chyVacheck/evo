/**
 * @file UnsupportedContentEncoding.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда кодировка контента не поддерживается.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда кодировка контента не поддерживается.
 */
export class UnsupportedContentEncodingException extends AppException {
	constructor({
		message = `Unsupported Content Encoding`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.UNSUPPORTED_CONTENT_ENCODING, origin, details, null);
	}
}