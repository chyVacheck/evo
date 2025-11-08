/**
 * @file SuccessResponse.ts
 * @module core/http/response
 *
 * @extends ApiResponse
 *
 * @description
 * Реализация успешного ответа API.
 * Представляет результат выполнения запроса с положительным исходом (статус 2xx).
 *
 * @details
 * Проверяет, что переданный статус действительно является успешным.
 *
 * Пример использования:
 * return new SuccessResponse(HttpStatusCode.CREATED, "User successfully created", userData, { "userId": 123 });
 *
 * @see ApiResponse
 * @see HttpStatusCode
 *
 * @throws Error если передан код ошибки вместо кода успеха
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import { HttpStatusCode } from '@core/http';
import { ApiResponse } from '@core/http/ApiResponse';

/**
 * Реализация успешного ответа API.
 */
export class SuccessResponse<T> extends ApiResponse {
	private data: T;

	/**
	 * Конструктор успешного ответа.
	 *
	 * @param status  HTTP-статус (только успешные коды 2xx)
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 */
	public constructor({
		status,
		message,
		details,
		data
	}: {
		status: HttpStatusCode;
		message: string;
		details: Record<string, any>;
		data: T;
	}) {
		super({ status, message, details });

		// проверка на передачу коректного успешного кода
		if (!status.isSuccess()) {
			throw new Error(
				'SuccessResponse can only use success HTTP status codes (2xx)!'
			);
		}

		this.data = data;
	}

	/**
	 * Получить данные ответа.
	 *
	 * @return объект данных
	 */
	public getData(): T {
		return this.data;
	}

	public toJSON() {
		return {
			message: this.getMessage(),
			details: this.getDetails(),
			data: this.getData()
		};
	}
}
