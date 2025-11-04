/**
 * @file mongo.config.ts
 * @module config
 */

/**
 * @description
 * Конфигурация подключения к MongoDB.
 *
 * @property {string} URL - URL подключения к MongoDB.
 * @property {string} DB_NAME - Название базы данных.
 * @property {number} TIMEOUT_MS - Таймаут операций по умолчанию (мс).
 */
export const MONGO_DB_CONFIG = {
	/**
	 * URL подключения к MongoDB.
	 * @default 'mongodb://localhost:27017/evo'
	 */
	URL: Bun.env.MONGO_DB_URL || 'mongodb://localhost:27017/evo',

	/** Название базы данных */
	DB_NAME: Bun.env.MONGO_DB_NAME || 'evo',

	/** Таймаут операций по умолчанию (мс) */
	TIMEOUT_MS: Number(Bun.env.MONGO_DB_TIMEOUT_MS ?? 10000)
};
