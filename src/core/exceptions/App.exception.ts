/**
 * @file AppException.ts
 * @module core/exceptions
 *
 * @extends Error
 *
 * @description
 * Базовый абстрактный класс всех пользовательских (кастомных) исключений в приложении.
 * Расширяет Error и добавляет дополнительные поля для более гибкой обработки ошибок в API.
 *
 * @details
 * Дополнительные поля:
 * - code: код ошибки (`ErrorCode`), отражающий тип ошибки
 * - details: дополнительные детали ошибки (например, параметры запроса)
 * - errors: конкретные ошибки валидации по полям
 *
 * Используется как родительский класс для всех специальных исключений (например, NotFoundUserException и др.).
 *
 * При генерации ответа API на ошибку формирует стандартную структуру ErrorResponse.
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import { ErrorCode } from '@core/exceptions/ErrorCode';
import { Exception } from '@core/types/exceptions/Exception';

/**
 * Абстрактный базовый класс для всех пользовательских исключений.
 */
export abstract class AppException extends Error implements Exception {
	/**
	 * Конструктор базового исключения.
	 *
	 * @param message текст ошибки для пользователя
	 * @param code    код ошибки (ErrorCode)
	 * @param origin  источник ошибки (например, имя контроллера)
	 * @param details дополнительные детали ошибки (параметры запроса)
	 * @param errors  ошибки валидации по полям
	 */
	public constructor(
		public readonly message: string,
		public readonly code: ErrorCode,
		public readonly origin: string,
		public readonly details: Record<string, any> | null = null,
		public readonly errors: Record<string, any> | null = null
	) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
	}

	/**
	 * Получить код ошибки.
	 *
	 * @return {ErrorCode} код ошибки
	 */
	public getErrorCode(): ErrorCode {
		return this.code;
	}

	/**
	 * Получить HTTP-статус ошибки.
	 *
	 * @return {number} числовой код HTTP-статуса (например, 400, 404, 500)
	 */
	public getStatus(): number {
		return this.code.getHttpStatus().getCode();
	}

	/**
	 * Получить название кода ошибки.
	 *
	 * @return {string} строковое имя кода ошибки
	 */
	public getErrorCodeName(): string {
		return this.code.getName();
	}

	/**
	 * Получить сообщение ошибки.
	 *
	 * @return {string} текст сообщения
	 */
	public getMessage(): string {
		return super.message;
	}

	/**
	 * Получить дополнительные детали ошибки.
	 *
	 * @return {Record<string, any> | null} карта деталей
	 */
	public getDetails(): Record<string, any> | null {
		return this.details;
	}

	/**
	 * Получить ошибки валидации по полям.
	 *
	 * @return {Record<string,any> | null} карта ошибок валидации
	 */
	public getErrors(): Record<string, any> | null {
		return this.errors;
	}

	// /**
	//  * Получить ошибки валидации по полям.
	//  *
	//  * @return {Record<string,any> | null} карта ошибок валидации
	//  */
	// toErrorResponse(requestId: string): ErrorResponse {
	// 	return new ErrorResponse({
	// 		requestId,
	// 		errorCode: this.errorCode,
	// 		message: this.message,
	// 		details: this.details,
	// 		errors: this.errors
	// 	});
	// }
}
