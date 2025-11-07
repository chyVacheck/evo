/**
 * @file pagination.ts
 * @module core/types/data
 *
 * @description
 * Типы данных для пагинации.
 */

/**
 * @description
 * Тип данных для пагинации.
 */
export type TPagination = {
	page: number;
	total: number;
	limit: number;
	totalPages: number;
};
