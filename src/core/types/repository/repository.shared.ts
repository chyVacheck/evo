/**
 * @file repository.shared.ts
 * @module core/types/repository
 *
 * @description
 * Типы данных для репозитория.
 */

/**
 * ! my imports
 */
import { TSort } from '@core/types/data';

/**
 * @description
 * Тип проекции для репозитория.
 *
 * @example
 * { field1: true, field2: false }
 */
export type TProjection<T> = Partial<Record<keyof T, boolean>>;

/**
 * @description
 * Тип контекста репозитория.
 *
 * @example
 * { requestId: '1234abcd', userId: '1234567890abcdef1234567890abcdef' }
 */
export type TRepoCtx = { requestId?: string; userId?: string };

/**
 * @description
 * Тип опций запроса к репозиторию.
 *
 * @example
 * { limit: 10, skip: 0, sort: { field1: 1, field2: -1 }, projection: { field1: true, field2: false } }
 */
export type TQueryOptions<T> = {
	limit?: number;
	skip?: number;
	sort?: TSort;
	projection?: TProjection<T>;
};

/**
 * @description
 * Тип общих опций репозитория.
 *
 * @example
 * { ctx: { requestId: '1234abcd', userId: '1234567890abcdef1234567890abcdef' }, driver: 'mongodb' }
 */
export type TRepoCommonOpts = {
	ctx?: TRepoCtx;
	driver?: unknown; // конкретный драйвер уточняет
};
