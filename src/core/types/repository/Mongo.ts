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
	type CollationOptions,
	type ObjectId
} from 'mongodb';

/**
 * ! my imports
 */
import { type DotNestedKeys } from '@core/types/common';

/**
 * @description
 * Тип идентификатора документа в MongoDB.
 */
export type TId = string | ObjectId | number;
export type TIds = Array<TId>;

/**
 * @description
 * Базовый документ MongoDB с возможным _id.
 */
export type BaseDoc = Document & { _id?: TId };

/**
 * @description
 * Направление сортировки: 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending'
 */
export type Direction = 1 | -1 | 'asc' | 'desc' | 'ascending' | 'descending';

/**
 * @description
 * Базовая проекция: 0|1 по всем путям сущности, КРОМЕ '_id'
 */
export type ProjectionCore<T> = Partial<Record<DotNestedKeys<T>, 0 | 1>>;

/**
 * @description
 * Проекция с обязательным включением _id:
 * - _id можно не указывать (вернётся по умолчанию),
 * - если указывать — то только 1;
 * - _id: 0 запрещён типами.
 */
export type ProjectionFor<T> = { _id?: 1 } & ProjectionCore<T>;

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
 * Общие write-опции для операций вставки (insertOne/insertMany).
 * Минимальный набор, близкий к драйверу MongoDB.
 */
interface BaseInsertOptions {
	/**
	 * Сессия MongoDB (для транзакций).
	 */
	session?: ClientSession;

	/**
	 * Комментарий к операции — уходит в логи MongoDB.
	 * На уровне сервиса обычно проставляем сюда requestId.
	 */
	comment?: string;

	/**
	 * Игнорировать поля со значением undefined при сериализации.
	 * Если true — такие поля не будут записаны.
	 */
	ignoreUndefined?: boolean;

	/**
	 * Сериализовать ли функции в BSON.
	 * Обычно не используется, но поддержано драйвером.
	 */
	serializeFunctions?: boolean;

	/**
	 * Проверять ли ключи документа на допустимость
	 * (запрет на поля с '.' и '$' в ключах).
	 */
	checkKeys?: boolean;

	/**
	 * Разрешить вставку документа, не прошедшего серверную валидацию schema validation.
	 * По умолчанию false.
	 */
	bypassDocumentValidation?: boolean;
}

/**
 * ? === === === CREATE === === ===
 */

/**
 * @description
 * Узкие, удобные опции для insertOne.
 */
export interface InsertOneOptionsRepo<T> extends BaseInsertOptions {
	// пока без доп-полей; если в проекте используется writeConcern на уровне операций,
	// можно добавить: writeConcern?: WriteConcern;
}

/**
 * @description
 * Узкие, удобные опции для insertMany.
 */
export interface InsertManyOptionsRepo<T> extends BaseInsertOptions {
	/**
	 * Порядок выполнения (ordered):
	 * - true (по умолчанию): остановится на первой ошибке
	 * - false: продолжит вставки даже при ошибках
	 */
	ordered?: boolean;
}

/**
 * ? === === === READ === === ===
 */

/**
 * @description
 * Общие опции фильтрации для чтения
 */
interface FilterOptions<T> {
	/** Максимальное время выполнения запроса в миллисекундах */
	maxTimeMS?: number;
	/** Подсказка индекса для ускорения поиска */
	hint?: HintSpec<T>;
	/** Сессия MongoDB для транзакций */
	session?: ClientSession;
	/** Комментарий к запросу, отображается в логи MongoDB */
	comment?: string;
}

/**
 * @description
 * Общие опции фильтрации для чтения
 */
export interface FilterReadOptionsRepo<T> extends FilterOptions<T> {
	/**
	 * @description
	 * Препаратив чтения: 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest'
	 */
	readPreference?: ReadPreferenceLike;
}

/**
 * @description
 * Узкие, удобные опции findOneByFilter
 */
export interface FindOneOptionsRepo<T> extends FilterReadOptionsRepo<T> {
	/**
	 * @description
	 * Проекция: 0|1 по ключам сущности (включая вложенные пути) + _id
	 */
	projection?: ProjectionFor<T>;
	/**
	 * @description
	 * Сортировка: 1|-1 по ключам сущности (включая вложенные пути)
	 */
	sort?: SortSpec<T>;
}

/**
 * @description
 * Пагинация (offset-based)
 */
export interface FindManyOptionsRepo<T> extends FindOneOptionsRepo<T> {
	/**
	 * @description
	 * Сколько элементов пропустить (offset) (0+)
	 */
	skip: number;
	/**
	 * @description
	 * Сколько вернуть элементов (обязательный лимит) (1+)
	 */
	limit: number;
}

/**
 * * === === === Exists === === ===
 */

/**
 * @description
 * Узкие, удобные опции existsByFilter
 */
export interface ExistsOptionsRepo<T> extends FilterReadOptionsRepo<T> {}

/**
 * * === === === Count === === ===
 */

/**
 * @description
 * Узкие, удобные опции countByFilter
 */
export interface CountOptionsRepo<T> extends FilterReadOptionsRepo<T> {}

/**
 * ? === === === UPDATE === === ===
 */

/**
 * @description
 * Узкие, удобные опции обновления одной сущности
 */
export interface UpdateOneOptionsRepo<T> extends FilterOptions<T> {
	upsert?: boolean;
	arrayFilters?: Array<Record<string, unknown>>;
	/** Если true, то игнорируется валидация документа на сервере. */
	bypassDocumentValidation?: boolean;
	/** Карта имён параметров и их значений, доступных через $$var (требуется MongoDB 5.0). */
	let?: Document;
}

/**
 * @description
 * Узкие, удобные опции обновления многих сущностей
 */
export interface UpdateManyOptionsRepo<T> extends UpdateOneOptionsRepo<T> {}

/**
 * @description
 * Узкие, удобные опции обновления одной сущности
 */
export interface ModifyOneOptionsRepo<T>
	extends Omit<UpdateOneOptionsRepo<T>, 'hint'> {
	hint?: Document;
	readPreference?: ReadPreferenceLike;
	projection?: ProjectionFor<T>;
	sort?: SortSpec<T>;
	/** Наш флаг: если true — вернуть обновлённый документ */
	returnUpdated?: boolean;
}

/**
 * ? === === === DELETE === === ===
 */

/**
 * @description
 * Узкие, удобные опции удаления одной сущности
 */
export interface DeleteOneOptionsRepo<T> extends FilterOptions<T> {
	collation?: CollationOptions;
}

/**
 * @description
 * Узкие, удобные опции удаления многих сущностей
 */
export interface DeleteManyOptionsRepo<T> extends DeleteOneOptionsRepo<T> {}
