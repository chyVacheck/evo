/**
 * @file Base.error.ts
 * @module core/errors
 *
 * @description
 * Базовый класс системных ошибок Evo (не путать с Exceptions).
 * Используется, когда нарушен жизненный цикл, инициализация или целостность ядра.
 */

export class BaseError extends Error {
	public readonly origin: string;
	public readonly fatal: boolean;

	constructor({
		message,
		origin,
		fatal = false
	}: {
		message: string;
		origin: string;
		fatal?: boolean;
	}) {
		super(message);
		this.name = this.constructor.name;
		this.origin = origin;
		this.fatal = fatal;
		Error.captureStackTrace?.(this, this.constructor);
	}
}
