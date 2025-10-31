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
	 * @param {number} code - Числовой код статуса (например, 200, 404)
	 * @returns Тот же объект TReply для цепочки вызовов
	 */
	status(code: number): HttpReply;
	/**
	 * Устанавливает HTTP-заголовок ответа.
	 *
	 * @param {string} name - Название заголовка (например, 'Content-Type')
	 * @param {string} value - Значение заголовка (например, 'application/json')
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
	 * @param {string} data - Текстовые данные, которые будут отправлены
	 * @returns void
	 */
	text(data: string): void;
	/**
	 * Отправляет произвольные бинарные данные.
	 *
	 * @param {string | Uint8Array | ArrayBuffer} data - Бинарные данные, которые будут отправлены
	 * @returns void
	 */
	send(data: string | Uint8Array | ArrayBuffer): void;
};

export type HttpContext<
	Params extends HttpParams = {},
	Query extends HttpQuery = {},
	Body = unknown,
	State extends object = {} // state: то, что добавляют middleware
> = {
	// сырые объекты
	rawReq: IncomingMessage;
	rawRes: ServerResponse;

	// базовая мета
	method: EHttpMethod;
	/**
	 * Сырой URL запроса (например, '/api/users/123?query=123')
	 */
	url: string;
	path: HttpPath;
	pathname: string | undefined;

	/** Нормализованные заголовки с lowercased ключами */
	headers: HttpHeaders;

	/** Единый нормализованный IP клиента */
	clientIp: string;

	/** Куки (если не распарсили — undefined) */
	cookies: HttpCookies | undefined;

	/** Инварианты запроса */
	/** Уникальный идентификатор запроса (устанавливается RequestIdMiddleware) */
	requestId: string;
	/** Метка времени начала обработки запроса (устанавливается StartTimerMiddleware) */
	startedAt: number;
	/**
	 * Путь маршрута, на который пришёл запрос (например, '/api/users/:id')
	 */
	matchedPath: HttpPath;

	/** Разобранные части */
	params: Params;
	query: Query;
	body: Body;

	/** Накопительное состояние от middleware */
	state: State;

	/** Хелперы ответа */
	reply: HttpReply;
};

// удобные алиасы
export type AnyHttpContext = HttpContext<any, any, any, any>;

/**
 * Сохраняем модификаторы свойств, меняем только state
 *
 * @template Context - Тип контекста запроса, который расширяет AnyHttpContext
 * @template Add - Тип добавляемых свойств состояния, который является подмножеством State
 *
 * @returns {MergeState<Context, Add>} - Новый контекст запроса с объединённым состоянием
 */
export type MergeState<Context extends AnyHttpContext, Add extends object> = {
	[K in keyof Context]: K extends 'state' ? Context['state'] & Add : Context[K];
};

/**
 * Добавляет новые параметры к контексту запроса.
 *
 * @template Context - Тип контекста запроса, который расширяет AnyHttpContext
 * @template P - Тип добавляемых параметров, который является подмножеством HttpParams
 *
 * @param {Context} context - Исходный контекст запроса
 * @param {P} params - Новые параметры, которые будут добавлены к контексту
 * @returns {MergeState<Context, P>} - Новый контекст запроса с объединённым состоянием
 */
export type WithParams<
	Context extends AnyHttpContext,
	P extends Record<string, string>
> = Omit<Context, 'params'> & { params: Context['params'] & P };
