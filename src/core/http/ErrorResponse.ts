/**
 * @file ErrorResponse.ts
 * @module core/http/response
 *
 * @extends ApiResponse
 *
 * @description
 * Реализация ответа API в случае ошибки.
 * Представляет результат запроса с ошибочным исходом (статус 4xx или 5xx).
 *
 * @details
 * Содержит:
 * - errorCode: тип ошибки (ErrorCode)
 * - message: сообщение
 * - errors: конкретные ошибки по полям
 * - details: дополнительные детали ошибки
 *
 * Пример использования:
 * return new ErrorResponse(ErrorCode.USER_NOT_FOUND, "User with this id not found", null, { "id": 123 }));
 *
 * @see ApiResponse
 * @see ErrorCode
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import { ErrorCode } from '@core/exceptions';
import { ApiResponse } from '@core/http/ApiResponse';

/**
 * Реализация ответа API в случае ошибки.
 */
export class ErrorResponse extends ApiResponse {
	private errorCode: ErrorCode;
	private errors: Record<string, string> | null;

	/**
	 * Конструктор ответа с ошибкой.
	 *
	 * @param errorCode код ошибки
	 * @param message   сообщение об ошибке
	 * @param errors    ошибки по полям (если есть)
	 * @param details   дополнительные детали ошибки
	 */
	public constructor({
		errorCode,
		message,
		errors,
		details
	}: {
		errorCode: ErrorCode;
		message: string;
		errors: Record<string, string> | null;
		details: Record<string, any> | null;
	}) {
		super({ status: errorCode.getHttpStatus(), message, details });

		this.errorCode = errorCode;
		this.errors = errors;
	}

	/**
	 * Получить код ошибки.
	 *
	 * @return ErrorCode
	 */
	public getErrorCode(): ErrorCode {
		return this.errorCode;
	}

	/**
	 * Получить ошибки по полям.
	 *
	 * @return карта ошибок по полям
	 */
	public getErrors(): Record<string, string> | null {
		return this.errors;
	}

	public toJSON() {
		return {
			errorCode: this.errorCode.getName(), // example: "UNKNOWN_PROPERTY"
			message: this.getMessage(), // example: "Property 'data' is unknown in this request"
			details: this.getDetails(), // example: { field: "data" }
			errors: this.getErrors() // example: null
		};
	}
}
