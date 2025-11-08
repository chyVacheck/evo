/**
 * @file Error.ts
 * @module core/types/errors
 *
 */

export type Error = {
	message: string;
	origin: string;
	fatal?: boolean;
};

export type ErrorConstructor = Omit<Error, 'message'> & {
	message?: string;
};
