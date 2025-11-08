/**
 * @file Headers.ts
 * @module core/types/http
 *
 * @description
 * Определения типов и перечислений для HTTP-заголовков.
 *
 * Тип заголовков запроса
 * @example
 * {
 * 	"Content-Type": "application/json",
 * 	"Authorization": "Bearer token"
 * }
 */

/**
 * ! my imports
 */
import { ContentType } from '@core/types/http/headers/ContentType';

/**
 * Тип для представления HTTP-заголовков в виде объекта с парой ключ-значение.
 * Подход к заголовкам:
 * - Node даёт lowercased ключи. Храним так же.
 * - Значение может быть string или string[] (как в Node).
 */
export type HttpHeaders = Record<string, HttpHeaderValue>;

export type HttpHeadersWithBody = HttpHeaders & {
	[EHttpHeaders.ContentLength]: string;
	[EHttpHeaders.ContentType]: ContentType;
};

export type HttpHeaderValue = string | Array<string>;

/**
 * Перечисление стандартных заголовков HTTP
 */
export enum EHttpHeaders {
	ContentType = 'content-type',
	ContentLength = 'content-length',
	TransferEncoding = 'transfer-encoding'
}
