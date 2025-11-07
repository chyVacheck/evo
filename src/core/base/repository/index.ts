/**
 * @file index.ts
 * @module core/base/repository
 *
 * @description
 * Сборный файл для экспорта всех базовых классов репозиториев из директории modules.
 * Удобен для импорта в других модулях, когда требуется доступ к нескольким базовым классам репозиториев.
 */

export * from './Repository.module';
export * from './MongoRepository.module';
