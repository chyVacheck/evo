/**
 * @file index.ts
 * @module core/types/logger
 *
 * @description
 * Сборный файл для экспорта всех типов из директории logger.
 * Удобен для импорта в других модулях, когда требуется доступ к нескольким типам.
 */

export * from './LogLevel';
export * from './LogStored';
export * from './Log';

export * from './LogOptions';
export * from './ConsolePrintOptions';
