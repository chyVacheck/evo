/**
 * @file Date.ts
 * @module core/types
 *
 * @description
 * Строгий брендированный тип строки даты в формате YYYY-MM-DD.
 * Используется для обеспечения типовой безопасности и предотвращения передачи произвольных строк.
 *
 * @example
 * const date: StrictDateString = toStrictDateString(new Date());
 *
 * @author Dmytro Shakh
 */

export declare const strictDateBrand: unique symbol;

/**
 * Регулярное выражение для YYYY-MM-DD
 */
export const strictDateRegex = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Строгий тип строки, представляющий дату в формате "YYYY-MM-DD"
 */
export type StrictDateString = string & { [strictDateBrand]: true };
