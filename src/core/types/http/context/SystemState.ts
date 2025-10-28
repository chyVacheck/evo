/**
 * @file SystemState.ts
 * @module core/types/http/context
 *
 * @description
 * Базовое состояние HTTP-запроса, добавляемое системными middleware.
 * Содержит технические данные, используемые для логирования, метрик и трейсинга.
 */

/**
 * @interface SystemState
 * @description
 * Базовое состояние HTTP-запроса, добавляемое системными middleware.
 * Содержит технические данные, используемые для логирования, метрик и трейсинга.
 */
export type SystemState = {
	/** Уникальный идентификатор запроса (устанавливается RequestIdMiddleware) */
	requestId: string;

	/** Метка времени начала обработки запроса (устанавливается StartTimerMiddleware) */
	startedAt: number;

	/** Путь маршрута, на который пришёл запрос (для логов и метрик) */
	matchedPath?: string;

	/** IP-адрес клиента */
	clientIp?: string;

	/** User-Agent клиента */
	userAgent?: string;

	/** Флаг, показывающий, что запрос системный (например, /health/ping) */
	isSystemRequest?: boolean;
};
