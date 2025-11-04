/**
 * @file pagination.ts
 * @module core/types/data
 *
 * @description
 * Типы данных для пагинации.
 */

export type TPagination = { page: number; pageSize: number };
export type TPagedResult<T> = {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
};
