/**
 * @file mongodb.ts
 * @module core/types/drivers
 *
 * @description
 * Типы данных для драйвера MongoDB.
 */

/**
 * ! lib imports
 */
import type { ClientSession } from 'mongodb';

/**
 * @description
 * Тип опций драйвера MongoDB.
 */
export type TMongoDriverOpts = {
	session?: ClientSession;
	signal?: AbortSignal;
	maxTimeMS?: number;
};
