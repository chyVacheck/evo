/**
 * @file UploadFile.request.ts
 * @module modules/file/request
 */

/**
 * ! lib imports
 */
import z from 'zod';

/**
 * @description
 * Схема валидации данных загрузки файла
 */
export const UploadFileSchema = z.object({});

/**
 * @description
 * Тип данных, полученный после валидации с помощью UploadFileSchema
 */
export type UploadFileRequest = z.infer<typeof UploadFileSchema>;
