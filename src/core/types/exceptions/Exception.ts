/**
 * @file AppException.ts
 * @module core/exceptions
 *
 */

/**
 * ! my imports
 */
import { type ErrorCode } from '@core/exceptions/ErrorCode';

export type Exception = {
	message: string;
	code: ErrorCode;
	origin: string;
	details: Record<string, any> | null;
	errors: Record<string, any> | null;
};
