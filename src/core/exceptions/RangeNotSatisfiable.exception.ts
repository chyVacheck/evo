/**
 * @file RangeNotSatisfiable.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда диапазон не может быть удовлетворен.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда диапазон не может быть удовлетворен.
 */
export class RangeNotSatisfiableException extends AppException {
	constructor({
		message = `Range Not Satisfiable`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.RANGE_NOT_SATISFIABLE, origin, details, null);
	}
}