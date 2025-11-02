/**
 * @file LoopDetected.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда обнаружен бесконечный цикл.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда обнаружен бесконечный цикл.
 */
export class LoopDetectedException extends AppException {
	constructor({
		message = `Loop Detected`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.LOOP_DETECTED, origin, details, null);
	}
}