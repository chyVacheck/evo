/**
 * @file ServiceResponse.ts
 * @module core/response
 *
 * @param <T> Тип данных, возвращаемых в ответе
 *
 * @see ServiceProcessType
 * @see SuccessResponse
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import { TPagination, ServiceProcessType } from '@core/types';

/**
 * Обобщённый ответ сервиса.
 *
 * @param <T> тип данных, связанных с выполненным процессом
 */
export class ServiceResponse<T> {
	private process: ServiceProcessType;
	private successful: boolean;
	private data: T;
	private pagination: TPagination | null;

	/**
	 * Конструктор ответа сервиса.
	 *
	 * @param process тип выполненного процесса
	 * @param data    данные результата выполнения операции
	 */
	public constructor(process: ServiceProcessType, data: T) {
		this.process = process;
		this.data = data;
		this.successful = false;
		this.pagination = null;
	}

	/**
	 * Получить тип выполненного процесса.
	 *
	 * @return тип процесса
	 */
	public getProcess(): ServiceProcessType {
		return this.process;
	}

	/**
	 * Установить тип выполненного процесса.
	 *
	 * @param {ServiceProcessType} process - тип процесса
	 */
	public setProcess(process: ServiceProcessType): this {
		this.process = process;
		return this;
	}

	/**
	 * Получить успех операции.
	 *
	 * @return {boolean} true если операция прошла успешно
	 */
	public isSuccessful(): boolean {
		return this.successful;
	}

	/**
	 * Устанавливает успех операции, как успешно.
	 */
	public markSuccessful(successful = true): this {
		this.successful = successful;
		return this;
	}

	/**
	 * Устанавливает успех операции, как провалена.
	 */
	public markFailed(): this {
		this.successful = false;
		return this;
	}

	/**
	 * Получить данные результата выполнения.
	 *
	 * @return данные
	 */
	public getData(): T {
		return this.data;
	}

	/**
	 * Получить данные о пагинации.
	 *
	 * @return данные пагинации
	 */
	public getPagination(): TPagination | null {
		return this.pagination;
	}

	/**
	 * Установить данные о пагинации.
	 *
	 * @param {TPagination} pagination данные о пагинации
	 */
	public setPagination(pagination: TPagination): this {
		this.pagination = pagination;
		return this;
	}

	/** CREATED(ED) — ресурс(ы) создан(ы). Обычно для create. */
	public static created<T>(data: T) {
		const resp = new ServiceResponse(ServiceProcessType.CREATED, data);
		resp.markSuccessful();
		return resp;
	}

	/** FOUND(ED) — ресурс(ы) найден(ы). Обычно для read. */
	public static founded<T>(data: T) {
		const resp = new ServiceResponse(ServiceProcessType.FOUNDED, data);
		resp.markSuccessful();
		return resp;
	}

	/** UPDATED(ED) — ресурс(ы) обновлён(ы). Обычно для update. */
	public static updated<T>(data: T) {
		const resp = new ServiceResponse(ServiceProcessType.UPDATED, data);
		resp.markSuccessful();
		return resp;
	}

	/** COUNTED(ED) — ресурс(ы) посчитан(ы). Обычно для count. */
	public static counted(data: number) {
		const resp = new ServiceResponse(ServiceProcessType.COUNTED, data);
		resp.markSuccessful();
		return resp;
	}

	/** RESTORED(ED) — ресурс(ы) восстановлен(ы). Обычно для restore. */
	public static restored<T>(data: T) {
		const resp = new ServiceResponse(ServiceProcessType.RESTORED, data);
		resp.markSuccessful();
		return resp;
	}

	/** DELETED(ED) — ресурс(ы) удалён(ы). Обычно для delete. */
	public static deleted<T>(data: T) {
		const resp = new ServiceResponse(ServiceProcessType.DELETED, data);
		resp.markSuccessful();
		return resp;
	}

	/** NOTHING — ничего не изменено. */
	private static _nothing<T>(data: T) {
		const resp = new ServiceResponse(ServiceProcessType.NOTHING, data);
		resp.markSuccessful();
		return resp;
	}

	/** Нечего обновлять - ничего не изменено. */
	public static nothingWrite<T>(data: T) {
		return this._nothing(data);
	}

	/** Нечего удалять - ничего не изменено. */
	public static nothingDeleted<T>(data: T) {
		return this._nothing(data);
	}
}
