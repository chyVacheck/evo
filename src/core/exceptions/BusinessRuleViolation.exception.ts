/**
 * @file BusinessRuleViolation.exception.ts
 * @module core/exceptions
 *
 * @description
 * Класс ошибки приложения, когда бизнес-логика нарушена.
 */

/**
 * ! my imports
 */
import { AppException } from '@core/exceptions/App.exception';
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * @description
 * Класс ошибки приложения, когда бизнес-логика нарушена.
 */
export class BusinessRuleViolationException extends AppException {
	constructor({
		message = `Business rule violation`,
		origin,
		details = null
	}: Omit<Exception, 'code'>) {
		super(message, ErrorCode.BUSINESS_RULE_VIOLATION, origin, details, null);
	}
}
