/**
 * @file sort.ts
 * @module core/types/data
 *
 * @description
 * Типы данных для сортировки.
 */

/**
 * @description
 * Тип данных для сортировки.
 *
 * @example
 * { field1: 1, field2: -1 }
 */
export type TSort = Record<string, 1 | -1>;
