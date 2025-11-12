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
import { ClientSession } from 'mongodb';

/**
 * ! my imports
 */
import {
	type InsertOneOptionsRepo,
	type InsertManyOptionsRepo,
	type FindOneOptionsRepo,
	type FindManyOptionsRepo,
	type CountOptionsRepo,
	type ExistsOptionsRepo,
	type UpdateOneOptionsRepo,
	type UpdateManyOptionsRepo,
	type ModifyOneOptionsRepo,
	type DeleteOneOptionsRepo,
	type DeleteManyOptionsRepo,
	type TId
} from '@core/types/repository';

export type ServiceMeta<TAuthorId = TId> = {
	requestId: string;
	authorId?: TAuthorId;
	session?: ClientSession;
	ip?: string;
	tenantId?: string;
};

/**
 * ? === === === CREATE === === ===
 */

/**
 * @description
 * Узкие, удобные опции вставки одной сущности
 */
export interface CreateOneOptions<T>
	extends Omit<InsertOneOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * @description
 * Узкие, удобные опции вставки многих сущностей
 */
export interface CreateManyOptions<T>
	extends Omit<InsertManyOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * ? === === === READ === === ===
 */

/**
 * @description
 * Опции для поиска одной сущности по фильтру.
 */
export interface FindOneOptions<T>
	extends Omit<FindOneOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * @description
 * Пагинация (offset-based)
 */
export interface FindManyOptions<T>
	extends Omit<
		FindManyOptionsRepo<T>,
		'comment' | 'session' | 'skip' | 'saveOrder'
	> {
	/**
	 * @description
	 * Номер страницы (1+)
	 */
	page?: number;
	/**
	 * @description
	 * Сохранить порядок возврата элементов.
	 */
	saveOrder?: boolean;
}

/**
 * * === === === Exists === === ===
 */

/**
 * @description
 * Опции для подсчета количества сущностей по фильтру.
 */
export interface ExistsOptions<T>
	extends Omit<ExistsOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * * === === === Count === === ===
 */

/**
 * @description
 * Опции для подсчета количества сущностей по фильтру.
 */
export interface CountOptions<T>
	extends Omit<CountOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * ? === === === UPDATE === === ===
 */

/**
 * @description
 * Узкие, удобные опции обновления одной сущности
 */
export interface UpdateOneOptions<T>
	extends Omit<UpdateOneOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * @description
 * Узкие, удобные опции обновления многих сущностей
 */
export interface UpdateManyOptions<T> extends UpdateManyOptionsRepo<T> {}

/**
 * @description
 * Узкие, удобные опции модификации одной сущности
 */
export interface ModifyOneOptions<T>
	extends Omit<ModifyOneOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * ? === === === DELETE === === ===
 */

/**
 * @description
 * Опции для удаления одной сущности по фильтру.
 */
export interface DeleteOneOptions<T>
	extends Omit<DeleteOneOptionsRepo<T>, 'comment' | 'session'> {}

/**
 * @description
 * Узкие, удобные опции удаления многих сущностей
 */
export interface DeleteManyOptions<T>
	extends Omit<DeleteManyOptionsRepo<T>, 'comment' | 'session'> {
	/**
	 * @description
	 * Разрешить обрезку коллекции (удаление всех документов).
	 */
	allowTruncate?: boolean;
}
