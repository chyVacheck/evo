/**
 * @file Headers.ts
 * @module core/types/http
 *
 * Базовые и расширенные типы для Content-Type c поддержкой параметров.
 */

// Шаблон для любых медиа-типов и параметров (RFC 9110)
export type MediaTypeBase = `${string}/${string}`;
export type MediaTypeWithParams = `${MediaTypeBase}; ${string}`; // например: application/json; charset=utf-8
export type MediaType = MediaTypeBase | MediaTypeWithParams;

/** Популярные application/* */
export type ContentTypeApplication =
	| 'application/json'
	| 'application/ld+json'
	| 'application/problem+json'
	| 'application/json-patch+json'
	| 'application/x-www-form-urlencoded'
	| 'application/javascript'
	| 'application/xml'
	| 'application/pdf'
	| 'application/graphql'
	| 'application/vnd.api+json'
	| 'application/octet-stream'
	| 'application/zip';

/** Популярные text/* */
export type ContentTypeText =
	| 'text/plain'
	| 'text/javascript'
	| 'text/html'
	| 'text/css'
	| 'text/csv'
	| 'text/markdown'
	| 'text/xml';

/** Популярные image/* */
export type ContentTypeImage =
	| 'image/png'
	| 'image/jpeg'
	| 'image/gif'
	| 'image/svg+xml'
	| 'image/webp'
	| 'image/avif'
	| 'image/bmp'
	| 'image/x-icon';

/** Популярные audio/* */
export type ContentTypeAudio =
	| 'audio/mpeg'
	| 'audio/aac'
	| 'audio/ogg'
	| 'audio/wav'
	| 'audio/webm'
	| 'audio/flac';

/** Популярные video/* */
export type ContentTypeVideo =
	| 'video/mp4'
	| 'video/webm'
	| 'video/quicktime'
	| 'video/x-matroska';

/**
 * Итоговый Content-Type:
 * - даём подсказки по популярным значениям (autocomplete),
 * - но не блокируем редкие/вендорные типы (через MediaType).
 */
export type ContentType =
	| ContentTypeApplication
	| 'multipart/form-data' // без параметров (см. ниже про boundary)
	| ContentTypeText
	| ContentTypeImage
	| ContentTypeAudio
	| ContentTypeVideo
	| MediaType; // fallback для любого корректного media type, включая параметры

/**
 * Хелперы для Content-Type:
 */

// Проверка, что это multipart/form-data с boundary (минимальная валидация)
export function isMultipartWithBoundary(ct: string | undefined): boolean {
	if (!ct) return false;
	const base = ct.split(';')[0]?.trim().toLowerCase();
	if (base !== 'multipart/form-data') return false;
	return /;\s*boundary=.+/i.test(ct);
}
