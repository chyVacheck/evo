/**
 * @file id.ts
 * @module core/types/data
 *
 * @description
 * Типы данных для идентификатора.
 */

/**
 * @description
 * Тип данных для идентификатора.
 *
 * @example
 * '1234567890abcdef1234567890abcdef'
 *
 * @type {string | number}
 */
export type TId = string | number;

/**
 * @description
 * Тип данных для массива идентификаторов.
 *
 * @example
 * ['1234567890abcdef1234567890abcdef', '1234567890abcdef1234567890abcdef']
 *
 * @type {Array<TId>}
 */
export type TIds = Array<TId>;
