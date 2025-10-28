/**
 * @file ValidationState.ts
 * @module core/types/http/context
 *
 * @description
 * Состояние контекста, добавляемое middleware валидации запроса.
 * Содержит прошедшие проверку данные из params, query и body.
 */

/**
 * @interface ValidationState
 * @template TParams - Тип объекта параметров (по умолчанию пустой объект)
 * @template TQuery - Тип объекта query параметров (по умолчанию пустой объект)
 * @template TBody - Тип объекта тела запроса (по умолчанию unknown)
 *
 * @description
 * Состояние контекста, добавляемое middleware валидации запроса.
 * Содержит прошедшие проверку данные из params, query и body.
 */
export type ValidationState<
	TParams extends Record<string, any> = {},
	TQuery extends Record<string, any> = {},
	TBody = unknown
> = {
	/** Проверенные данные запроса */
	validated: {
		params?: TParams;
		query?: TQuery;
		body?: TBody;
	};
};
