/**
 * @file Common.ts
 * @module core/types/http
 * @description Общие типы HTTP
 */

/**
 * Методы HTTP
 */
export enum EHttpMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	PATCH = 'PATCH',
	DELETE = 'DELETE',
	HEAD = 'HEAD',
	OPTIONS = 'OPTIONS'
}
export type HttpMethod = `${EHttpMethod}`;
/**
 * Тип параметров маршрута (например, ":id" в "/users/:id")
 * @example
 * {
 * 	id: "1"
 * }
 */
export type HttpParams = Record<string, string>;
/**
 * Тип запроса (например, "?page=1" в "/users?page=1")
 * @example
 * {
 * 	page: "1"
 * }
 * @example
 * {
 * 	ids: ["1", "2"]
 * }
 */
export type HttpQuery = Record<string, string | Array<string>>;
/**
 * Тип заголовков запроса
 * @example
 * {
 * 	"Content-Type": "application/json",
 * 	"Authorization": "Bearer token"
 * }
 */
export type HttpHeaders = Record<string, string>;
/**
 * Cookies
 * @example
 * {
 * 	"session_id": "123456"
 * }
 */
export type HttpCookies = Record<string, string>;
/**
 * Тип пути запроса (например, "/users/:id")
 * @example
 * "/users/:id"
 */
export type HttpPath = `/${string}`;
