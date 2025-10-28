/**
 * @file AuthState.ts
 * @module core/types/http/context
 *
 * @description
 * Состояние контекста, добавляемое middleware авторизации.
 * Хранит информацию о текущем пользователе в виде дженерика.
 */

/**
 * @interface AuthState
 * @template TUser - Тип объекта пользователя (по умолчанию unknown)
 *
 * @description
 * Состояние контекста, добавляемое middleware авторизации.
 * Хранит информацию о текущем пользователе в виде дженерика.
 */
export type AuthState<TUser = unknown> = {
	/** Объект текущего пользователя */
	user: TUser;
};
