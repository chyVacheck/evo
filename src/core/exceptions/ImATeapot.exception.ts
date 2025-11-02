/**
 * @file ImATeapot.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда сервер отказывается заваривать кофе, потому что он чайник.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда сервер отказывается заваривать кофе, потому что он чайник.
 */
export class ImATeapotException extends AppException {
	constructor({
		message = `I'm a teapot`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.IM_A_TEAPOT, origin, details, null);
	}
}