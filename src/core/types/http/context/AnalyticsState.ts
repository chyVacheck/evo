/**
 * @file AnalyticsState.ts
 * @module core/types/http/context
 *
 * @description
 * Состояние контекста, формируемое аналитическими middleware.
 * Содержит бизнес-метрики и данные для пользовательской аналитики.
 */

export type AnalyticsState = {
	/** Идентификатор пользовательской сессии */
	sessionId?: string;

	/** Идентификатор рекламной кампании или источника трафика */
	referralId?: string;

	/** Имя события (например, "page_view" или "purchase") */
	eventName?: string;

	/** Произвольные метки события */
	tags?: Record<string, string | number | boolean>;
};
