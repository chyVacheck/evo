/**
 * @file Primitives.ts
 * @module core/types/common
 *
 * @description
 * Базовые типы, в которые углубляться не нужно
 */

/**
 * @description
 * Базовые типы, в которые углубляться не нужно
 */
export type Builtin =
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined
	| Date
	| RegExp
	| Function
	| Uint8Array
	| ArrayBuffer;

/**
 * @description
 * Тип, который может быть равен значению T или null
 */
export type Nullable<T> = T | null;
