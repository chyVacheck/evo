/**
 * @file server.config.ts
 * @module config
 */

/**
 * @description
 * Конфигурация сервера.
 *
 * @property {number} PORT - Порт, на котором будет работать сервер.
 * @property {string} NODE_ENV - Режим работы сервера.
 */
export const SERVER_CONFIG = {
	/**
	 * Порт, на котором будет работать сервер.
	 * @default 6070
	 */
	PORT: Number(Bun.env.PORT) || 6070,
	/**
	 * Режим работы сервера:
	 * - development: логирование, отладка
	 * - test: тестовый режим
	 * - production: продакшн режим, без отладки
	 * @default 'development'
	 */
	NODE_ENV: Bun.env.NODE_ENV || 'development'
};
