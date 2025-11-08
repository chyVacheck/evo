/**
 * @file BaseError.ts
 * @module core/errors
 *
 * @description
 * Базовый класс системных ошибок Evo (не путать с Exceptions).
 * Используется, когда нарушен жизненный цикл, инициализация или целостность ядра.
 */

export * from './Base.error';
export * from './Configuration.error';
export * from './Dependency.error';
export * from './Initialization.error';
export * from './RouteConflict.error';
