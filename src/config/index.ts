/**
 * Конфигурация приложения
 * @module config
 * @description
 * Централизует конфигурацию приложения из нескольких источников:
 * - Переменные окружения (.env)
 * - JSON-файлы конфигурации
 * - Значения по умолчанию
 */

export * from './logger.config';
export * from './mongo.config';
export * from './server.config';
