/**
 * @file ApiResponse.ts
 *
 * @description
 * Абстрактный базовый класс для всех ответов API.
 * Содержит общие поля и методы для успешных и ошибочных ответов.
 *
 * @details
 * Основные поля:
 * - status: HTTP-статус ответа
 * - message: текстовое сообщение для клиента
 * - details: дополнительные данные ответа
 *
 * Используется как базовый класс для SuccessResponse и ErrorResponse.
 *
 *
 * @see SuccessResponse
 * @see ErrorResponse
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import { HttpStatusCode } from '@core/http';

/**
 * Абстрактный базовый класс для всех ответов API.
 */
export abstract class ApiResponse {
	private status: HttpStatusCode;
	private message: string;
	private details?: Record<string, any>;

	/**
	 * Конструктор базового ответа.
	 *
	 * @param status  HTTP-статус
	 * @param message текстовое сообщение
	 * @param details дополнительные детали ответа
	 */
	public constructor({
		status,
		message,
		details
	}: {
		status: HttpStatusCode;
		message: string;
		details: Record<string, any> | undefined;
	}) {
		this.status = status;
		this.message = message;
		if (details) {
			this.details = details;
		}
	}

	/**
	 * Получить числовой код HTTP-статуса.
	 *
	 * @return код статуса
	 */
	public getStatusCode(): number {
		return this.status.getCode();
	}

	/**
	 * Получить строковое имя HTTP-статуса.
	 *
	 * @return имя статуса
	 */
	public getHttpStatusName(): string {
		return this.status.getName();
	}

	/**
	 * Получить текстовое сообщение ответа.
	 *
	 * @return сообщение
	 */
	public getMessage(): string {
		return this.message;
	}

	/**
	 * Получить дополнительные детали ответа.
	 *
	 * @return карта дополнительных деталей
	 */
	public getDetails(): Record<string, any> | undefined {
		return this.details;
	}

	abstract toJSON(): Object;
}
