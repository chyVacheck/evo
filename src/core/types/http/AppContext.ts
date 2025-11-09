/**
 * @file AppContext.ts
 * @module core/types/http
 *
 * @description
 * Главный тип HTTP-контекста приложения.
 * Объединяет базовый контекст запроса и набор стандартных состояний (state),
 * формируемых системными и бизнес middleware.
 */

/**
 * ! my imports
 */
import { ComposeState } from '@core/types/http/Middleware';
import {
	AuthState,
	ValidationState,
	MetricsState,
	AnalyticsState,
	HttpContext
} from '@core/types/http/context';
import { HttpParams, HttpQuery } from '@core/types/http/Common';

/**
 * @interface AppContext
 * @template TUser - Тип объекта пользователя (по умолчанию unknown)
 * @template TParams - Тип объекта параметров (по умолчанию пустой объект)
 * @template TQuery - Тип объекта query параметров (по умолчанию пустой объект)
 * @template TBody - Тип объекта тела запроса (по умолчанию unknown)
 *
 * @description
 * Универсальный контекст приложения, объединяющий все ключевые состояния.
 *
 * Состав:
 * - **AuthState** — информация о текущем пользователе
 * - **ValidationState** — проверенные параметры запроса
 * - **MetricsState** — метрики производительности
 * - **AnalyticsState** — данные бизнес-аналитики
 *
 * @example
 * ```ts
 * type User = { id: string; email: string };
 * type Params = { userId: string };
 * type Query = { active?: boolean };
 * type Body = { note: string };
 *
 * type MyCtx = AppContext<User, Params, Query, Body>;
 * ```
 */
export type AppContext<
	TUser = unknown,
	TParams extends HttpParams = {},
	TQuery extends HttpQuery = {},
	TBody = unknown
> = ComposeState<
	HttpContext<TParams, TQuery, TBody>,
	[
		AuthState<TUser>,
		ValidationState<TParams, TQuery, TBody>,
		MetricsState,
		AnalyticsState
	]
>;

export type AppContextUnauthorized<
	TParams extends HttpParams = {},
	TQuery extends HttpQuery = {},
	TBody = unknown
> = AppContext<unknown, TParams, TQuery, TBody>;
