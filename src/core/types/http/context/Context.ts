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
	HttpParams,
	HttpPath,
	HttpQuery
} from '@core/types/http/Common';
import {
	HttpHeaders,
	HttpHeadersWithBody
} from '@core/types/http/headers/Headers';
import { SuccessResponse } from '@core/http';
import { PathParamsOf } from '../Path';

export type HttpReply = {
	fromApiResponse<T = unknown>(response: SuccessResponse<T>): HttpReply;
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

/**
 * Контекст запроса.
 *
 * @template Params - Тип параметров пути (например, { id: string })
 * @template Query - Тип query-параметров (например, { page: number })
 * @template Body - Тип тела запроса (например, UserCreateDto)
 * @template State - Тип состояния контекста, расширяющий { validated: {} }
 */
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
	/**
	 * Парсинг pathname из URL (например, '/api/users/123' из '/api/users/123?query=123')
	 */
	pathname: string | undefined;
	/**
	 * Путь маршрута, на который пришёл запрос (например, '/api/users/:id')
	 */
	matchedPath: HttpPath;

	/** Нормализованные заголовки с lowercased ключами */
	headers: HttpHeaders | HttpHeadersWithBody;
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
	 * Сырой тело запроса (если не распарсили — null)
	 */
	rawBody: Buffer | null;
	/**
	 * Размер сыраяго тела запроса (если не распарсили — 0)
	 */
	bodySize: number | null;
	/**
	 * Кодировка тела запроса (если не распарсили — 'utf-8')
	 */
	charset: BufferEncoding;
	/**
	 * Парсинг параметров из пути (например, { id: '123' } из '/api/users/:id')
	 */
	params: Params;
	/**
	 * Парсинг query-параметров из URL (например, { query: '123' } из '/api/users/123?query=123')
	 */
	query: Query;
	/**
	 * Парсинг тела запроса в объект (если не распарсили — null)
	 */
	body: Body;

	/**
	 * Накопительное состояние от middleware
	 */
	state: { validated: {} } & State;

	/**
	 * Хелперы ответа
	 */
	reply: HttpReply;
};

/**
 * Контекст запроса с валидированными данными.
 * @description
 * Рекомендовано использовать в контроллерах, так как они должны работать с
 * валидированными данными, а не с сырым body.
 *
 * @template Url - Тип параметров пути (например, { id: string })
 * @template Query - Тип query-параметров (например, { page: number })
 * @template State - Тип состояния контекста, расширяющий { validated: {} }
 */
export type HttpContextValidated<
	Url extends HttpPath,
	Query extends HttpQuery = {},
	State extends object = {}
> = HttpContext<PathParamsOf<Url>, Query, unknown, State & { validated: {} }>;

// удобные алиасы
export type AnyHttpContext = HttpContext<any, any, any, any>;

/**
 * Умный тип объединения состояния контекста.
 * Гарантирует, что в результирующем контексте:
 * - Все свойства исходного контекста сохраняются.
 * - Поле `state` аккуратно мержится, без потери вложенных полей.
 *
 * @template Context - Тип контекста запроса, который расширяет AnyHttpContext
 * @template Add - Тип добавляемых свойств состояния, который является подмножеством State
 *
 * @returns {MergeState<Context, Add>} - Новый контекст запроса с объединённым состоянием
 */
export type MergeState<
	Context extends AnyHttpContext,
	Add extends object
> = Omit<Context, 'state'> & {
	state: Context['state'] extends object ? Context['state'] & Add : Add;
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
