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
		details: Record<string, any> | undefined;
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

	/**
	 * Создать успешный ответ с кодом 200 OK.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 200
	 */
	public static ok<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.OK,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 201 Created.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 201
	 */
	public static created<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.CREATED,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 202 Accepted.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 202
	 */
	public static accepted<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.ACCEPTED,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 203 Non-Authoritative Information.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 203
	 */
	public static nonAuthoritativeInformation<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.NON_AUTHORITATIVE_INFO,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 204 No Content.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 204
	 */
	public static noContent({
		message,
		details
	}: {
		message: string;
		details?: Record<string, any>;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.NO_CONTENT,
			message,
			details,
			data: null
		});
	}

	/**
	 * Создать успешный ответ с кодом 205 Reset Content.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 205
	 */
	public static resetContent<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.RESET_CONTENT,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 206 Partial Content.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 206
	 */
	public static partialContent<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.PARTIAL_CONTENT,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 207 Multi-Status.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 207
	 */
	public static multiStatus<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.MULTI_STATUS,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 208 Already Reported.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 208
	 */
	public static alreadyReported<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.ALREADY_REPORTED,
			message,
			details,
			data
		});
	}

	/**
	 * Создать успешный ответ с кодом 209 IM Used.
	 *
	 * @param message сообщение для клиента
	 * @param details дополнительные детали ответа
	 * @param data    данные ответа
	 *
	 * @return экземпляр SuccessResponse с кодом 209
	 */
	public static imUsed<T>({
		message,
		details,
		data
	}: {
		message: string;
		details?: Record<string, any>;
		data: T;
	}) {
		return new SuccessResponse({
			status: HttpStatusCode.IM_USED,
			message,
			details,
			data
		});
	}

	public toJSON() {
		const json = {
			message: this.getMessage(),
			details: this.getDetails(),

			data: this.getData()
		};

		return json;
	}
}
