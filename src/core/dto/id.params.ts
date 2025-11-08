/**
 * @file id.params.ts
 * @module core/dto
 */

/**
 * ! lib imports
 */
import z from 'zod';

/**
 * @description
 * Схема валидации данных идентификатора
 */
export const ObjectIdParamsSchema = z.object({
	id: z.string().trim().length(24)
});

/**
 * @description
 * Тип данных, полученный после валидации с помощью idParamsSchema
 */
export type ObjectIdParamsRequest = z.infer<typeof ObjectIdParamsSchema>;
