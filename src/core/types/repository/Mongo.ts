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
import { ProjectionCore, SortSpec } from '@core/types/repository/Common';

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
 * Проекция с обязательным включением _id:
 * - _id можно не указывать (вернётся по умолчанию),
 * - если указывать — то только 1;
 * - _id: 0 запрещён типами.
 */
export type MongoProjectionFor<T> = { _id?: 1 } & ProjectionCore<T>;

/**
 * @description
 * Сортировка: 1|-1 по ключам сущности (включая вложенные пути)
 */
export type SortMongoSpec<T> = Sort & SortSpec<T>;

/**
 * @description
 * Подсказка индекса: строка имени индекса или спецификация полей
 */
export type HintMongoSpec<T> =
	| string
	| Document
	| Partial<Record<DotNestedKeys<T>, 1 | -1>>;

/**
 * @description
 * Общие write-опции для операций вставки (insertOne/insertMany).
 * Минимальный набор, близкий к драйверу MongoDB.
 */
interface BaseMongoInsertOptions {
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
export interface InsertOneMongoOptionsRepo<T> extends BaseMongoInsertOptions {
	// пока без доп-полей; если в проекте используется writeConcern на уровне операций,
	// можно добавить: writeConcern?: WriteConcern;
}

/**
 * @description
 * Узкие, удобные опции для insertMany.
 */
export interface InsertManyMongoOptionsRepo<T> extends BaseMongoInsertOptions {
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
interface FilterMongoOptions<T> {
	/** Максимальное время выполнения запроса в миллисекундах */
	maxTimeMS?: number;
	/** Подсказка индекса для ускорения поиска */
	hint?: HintMongoSpec<T>;
	/** Сессия MongoDB для транзакций */
	session?: ClientSession;
	/** Комментарий к запросу, отображается в логи MongoDB */
	comment?: string;
}

/**
 * @description
 * Общие опции фильтрации для чтения
 */
export interface FilterReadMongoOptionsRepo<T> extends FilterMongoOptions<T> {
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
export interface FindOneMongoOptionsRepo<T>
	extends FilterReadMongoOptionsRepo<T> {
	/**
	 * @description
	 * Проекция: 0|1 по ключам сущности (включая вложенные пути) + _id
	 */
	projection?: MongoProjectionFor<T>;
	/**
	 * @description
	 * Сортировка: 1|-1 по ключам сущности (включая вложенные пути)
	 */
	sort?: SortMongoSpec<T>;
}

/**
 * @description
 * Пагинация (offset-based)
 */
export interface FindManyMongoOptionsRepo<T>
	extends FindOneMongoOptionsRepo<T> {
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
export interface ExistsMongoOptionsRepo<T>
	extends FilterReadMongoOptionsRepo<T> {}

/**
 * * === === === Count === === ===
 */

/**
 * @description
 * Узкие, удобные опции countByFilter
 */
export interface CountMongoOptionsRepo<T>
	extends FilterReadMongoOptionsRepo<T> {}

/**
 * ? === === === UPDATE === === ===
 */

/**
 * @description
 * Узкие, удобные опции обновления одной сущности
 */
export interface UpdateOneMongoOptionsRepo<T> extends FilterMongoOptions<T> {
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
export interface UpdateManyMongoOptionsRepo<T>
	extends UpdateOneMongoOptionsRepo<T> {}

/**
 * @description
 * Узкие, удобные опции обновления одной сущности
 */
export interface ModifyOneMongoOptionsRepo<T>
	extends Omit<UpdateOneMongoOptionsRepo<T>, 'hint'> {
	hint?: Document;
	readPreference?: ReadPreferenceLike;
	projection?: MongoProjectionFor<T>;
	sort?: SortMongoSpec<T>;
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
export interface DeleteOneMongoOptionsRepo<T> extends FilterMongoOptions<T> {
	collation?: CollationOptions;
}

/**
 * @description
 * Узкие, удобные опции удаления многих сущностей
 */
export interface DeleteManyMongoOptionsRepo<T>
	extends DeleteOneMongoOptionsRepo<T> {}
