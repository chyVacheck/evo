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
	AnyHttpContext,
	SystemState,
	AuthState,
	ValidationState,
	MetricsState,
	AnalyticsState
} from '@core/types/http/context';

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
 * - **SystemState** — базовые данные запроса (requestId, startedAt и т.д.)
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
	TParams extends Record<string, any> = {},
	TQuery extends Record<string, any> = {},
	TBody = unknown
> = ComposeState<
	AnyHttpContext,
	[
		SystemState,
		AuthState<TUser>,
		ValidationState<TParams, TQuery, TBody>,
		MetricsState,
		AnalyticsState
	]
>;
