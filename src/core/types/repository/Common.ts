/**
 * @file common.ts
 * @module core/types/repository/common
 *
 * @description
 * Типы для работы репозиториев.
 */

/**
 * ! my imports
 */
import { type DotNestedKeys } from '@core/types/common';

/**
 * @description
 * Направление сортировки: 'asc' | 'desc'
 * (можно оставить и другие алиасы, если хочется совместимости со старым кодом)
 */
export type Direction = 'asc' | 'desc' | 1 | -1 | 'ascending' | 'descending';

/**
 * @description
 * Базовая проекция: 0|1 по всем путям сущности, КРОМЕ '_id'
 */
export type ProjectionCore<T> = Partial<Record<DotNestedKeys<T>, 0 | 1>>;

/**
 * @description
 * Сортировка: 1|-1|'asc'|'desc' по ключам сущности (включая вложенные пути)
 */
export type SortSpec<T> = Partial<Record<DotNestedKeys<T>, Direction>>;
