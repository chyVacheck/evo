/**
 * @file CreateUser.request.ts
 * @module modules/user/request
 */

/**
 * ! lib imports
 */
import z from 'zod';

/**
 * @description
 * Схема валидации данных создания пользователя
 */
export const CreateUserSchema = z.object({
	name: z.string().trim().min(1),
	email: z.email().trim().toLowerCase()
});

/**
 * @description
 * Тип данных, полученный после валидации с помощью createUserSchema
 */
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
