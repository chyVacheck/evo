/**
 * @file Dot.ts
 * @module core/types/common
 *
 * @description
 * Типы для работы с вложенными объектами через dot-notation.
 */

/**
 * ! my imports
 */
import { Builtin } from '@core/types/common/Primitives';

/**
 * @description
 * Глубина вложенности для dot-notation.
 */
type Depth = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
/**
 * @description
 * Предыдущая глубина вложенности для dot-notation.
 */
type Prev = { 0: 0; 1: 0; 2: 1; 3: 2; 4: 3; 5: 4; 6: 5; 7: 6; 8: 7 };

/**
 * @description
 * Строим "a.b" из "a" и "b"
 */
type DotPrefix<K extends string, Rest> = Rest extends string
	? `${K}.${Rest}`
	: never;

/**
 * @description
 * Безопасные dot-ключи с ограниченной глубиной и поддержкой массивов
 */
export type DotNestedKeys<T, D extends Depth = 3> = D extends 0
	? never
	: T extends Builtin
	? never
	: T extends ReadonlyArray<infer U>
	? DotNestedKeys<U, Prev[D]>
	: T extends object
	? {
			[K in Extract<keyof T, string>]: T[K] extends Builtin
				? K
				: T[K] extends ReadonlyArray<infer U2>
				? K | DotPrefix<K, DotNestedKeys<U2, Prev[D]>>
				: T[K] extends object
				? K | DotPrefix<K, DotNestedKeys<T[K], Prev[D]>>
				: K;
	  }[Extract<keyof T, string>]
	: never;
