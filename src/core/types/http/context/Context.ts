/**
 * @file Context.ts
 * @module core/types/http
 * @description Тип контекста запроса
 */

/**
 * ! lib imports
 */
import { IncomingMessage, ServerResponse } from 'http';

/**
 * ! my imports
 */
import {
	EHttpMethod,
	HttpCookies,
	HttpHeaders,
	HttpParams,
	HttpPath,
	HttpQuery
} from '@core/types/http/Common';

export type HttpReply = {
	/**
	 * Устанавливает HTTP-статус ответа.
	 *
	 * @param code - Числовой код статуса (например, 200, 404)
	 * @returns Тот же объект TReply для цепочки вызовов
	 */
	status(code: number): HttpReply;
	/**
	 * Устанавливает HTTP-заголовок ответа.
	 *
	 * @param name - Название заголовка (например, 'Content-Type')
	 * @param value - Значение заголовка (например, 'application/json')
	 * @returns Тот же объект TReply для цепочки вызовов
	 */
	set(name: string, value: string): HttpReply;
	/**
	 * Отправляет JSON-ответ.
	 *
	 * @param data - Данные, которые будут сериализованы в JSON
	 * @returns void
	 */
	json<T = unknown>(data: T): void;
	/**
	 * Отправляет текстовый ответ.
	 *
	 * @param data - Текстовые данные, которые будут отправлены
	 * @returns void
	 */
	text(data: string): void;
	/**
	 * Отправляет произвольные бинарные данные.
	 *
	 * @param data - Бинарные данные, которые будут отправлены
	 * @returns void
	 */
	send(data: string | Uint8Array | ArrayBuffer): void;
};

export type HttpContext<
	Params extends HttpParams = {},
	Query extends HttpQuery = {},
	Body = unknown,
	S extends object = {} // state: то, что добавляют middleware
> = {
	// сырые объекты
	rawReq: IncomingMessage;
	rawRes: ServerResponse;

	// базовая мета
	method: EHttpMethod;
	url: string;
	path: HttpPath;
	pathname: string | undefined;
	headers: HttpHeaders;
	ip: string;
	cookies: HttpCookies | undefined;

	// разобранные части
	params: Params;
	query: Query;
	body: Body;

	// накопительное состояние от middleware
	state: S;

	// reply-хелперы (реализация позже)
	reply: HttpReply;
};

// удобные алиасы
export type AnyHttpContext = HttpContext<any, any, any, any>;

/**
 * Сохраняем модификаторы свойств, меняем только state
 */
export type MergeState<C extends AnyHttpContext, Add extends object> = {
	[K in keyof C]: K extends 'state' ? C['state'] & Add : C[K];
};
