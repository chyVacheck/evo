/**
 * @file BandwidthLimitExceeded.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда превышен лимит пропускной способности.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { ExceptionConstructor } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда превышен лимит пропускной способности.
 */
export class BandwidthLimitExceededException extends AppException {
	constructor({
		message = `Bandwidth Limit Exceeded`,
		origin,
		details = null,
		errors = null
	}: ExceptionConstructor) {
		super(message, ErrorCode.BANDWIDTH_LIMIT_EXCEEDED, origin, details, errors);
	}
}
