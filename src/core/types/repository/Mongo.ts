/**
 * @file Mongo.ts
 * @module core/types/repository
 *
 * @description
 * Типы для работы репозитория с MongoDB.
 */

/**
 * ! lib imports
 */
import {
	type Sort,
	type ReadPreferenceLike,
	type ClientSession,
	type Document,
	type WithId
} from 'mongodb';

/**
 * ! my imports
 */
import { DotNestedKeys } from '@core/types/common';

/**
 * @description
 * Направление сортировки: 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'
 */
export type Direction = 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';

/**
 * @description
 * Проекция: 0|1 по ключам сущности (включая вложенные пути) + _id
 */
export type ProjectionFor<T> = Partial<Record<DotNestedKeys<T> | '_id', 0 | 1>>;

/**
 * @description
 * Сортировка: 1|-1 по ключам сущности (включая вложенные пути)
 */
export type SortSpec<T> = Sort & Partial<Record<DotNestedKeys<T>, Direction>>;

/**
 * @description
 * Подсказка индекса: строка имени индекса или спецификация полей
 */
export type HintSpec<T> =
	| string
	| Document
	| Partial<Record<DotNestedKeys<T>, 1 | -1>>;

/**
 * @description
 * Узкие, удобные опции findOneByFilter
 */
export interface FindOneByFilterOptions<T> {
	projection?: ProjectionFor<T>;
	sort?: SortSpec<T>;
	maxTimeMS?: number;
	hint?: HintSpec<T>;
	readPreference?: ReadPreferenceLike;
	session?: ClientSession;
	comment?: string;
}

/**
 * @description
 * Пагинация (offset-based)
 */
export interface FindManyByFilterOptions<T> extends FindOneByFilterOptions<T> {
	/** Сколько вернуть элементов (обязательный лимит) */
	limit: number;
	/** Номер страницы (1+) */
	page?: number;
}

/**
 * @description
 * Структура результата множественного поиска
 */
export interface FindManyByFilterResult<T> {
	items: Array<WithId<T>>;
	limit: number;
	/** Возвращаем всегда вычисленное фактическое смещение */
	skip: number;
	/** Возвращаем всегда вычисленное фактическое смещение */
	page: number;
	/** Есть ли следующая страница */
	hasNextPage: boolean;
}
