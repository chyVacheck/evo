/**
 * @file index.ts
 * @module core/base
 *
 * @description
 * Сборный файл для экспорта всех базовых классов из директории modules.
 * Удобен для импорта в других модулях, когда требуется доступ к нескольким базовым классам.
 */

export * from './Core.module';
export * from './Util.module';
export * from './Base.module';

export * from './middleware';

export * from './Router.module';
export * from './Controller.module';
export * from './service';
export * from './repository';
export * from './model';
