/**
 * @file Path.ts
 * @module core/types/http
 * @description Тип параметров маршрута (например, ":id" в "/users/:id")
 */

/**
 * @file Path.ts
 * @module core/types/http
 * @description Тип параметров маршрута (например, ":id" в "/users/:id")
 */
import { HttpPath } from './Common';

/**
 * @description
 * Тип имен параметров маршрута (например, "id" в "/users/:id")
 */
export type PathParamNames<S extends string> =
	S extends `${string}:${infer P}/${infer R}`
		? P | PathParamNames<`/${R}`>
		: S extends `${string}:${infer P}`
		? P
		: never;

/**
 * @description
 * Тип параметров маршрута (например, { id: "123" } в "/users/:id")
 */
export type PathParamsOf<Path extends HttpPath> =
	PathParamNames<Path> extends never
		? {}
		: Record<PathParamNames<Path>, string>;
