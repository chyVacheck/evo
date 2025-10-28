/**
 * @file MetricsState.ts
 * @module core/types/http/context
 *
 * @description
 * Состояние контекста, используемое middleware метрик.
 * Содержит показатели производительности и статусы выполнения запроса.
 */

export type MetricsState = {
	/** Время выполнения запроса (в миллисекундах) */
	durationMs?: number;

	/** Размер тела ответа (в байтах) */
	responseSize?: number;

	/** Имя сервиса или модуля, обслуживающего запрос */
	service?: string;

	/** Метка состояния (например: ok, error, slow, cached) */
	statusLabel?: 'ok' | 'error' | 'slow' | 'cached';
};
