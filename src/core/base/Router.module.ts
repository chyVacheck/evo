/**
 * @file Router.module.ts
 * @module core/base
 *
 * @description
 * Базовый абстрактный класс роутера.
 * Управляет:
 * - глобальными middleware (before, after, finally)
 * - локальными middleware для отдельных маршрутов
 * - регистрацией маршрутов
 * - построением финального пайплайна (исполняемого обработчика)
 *
 * @see EModuleType
 *
 * @example
 * class SomeCustomRouter extends RouterModule {
 *   constructor() {
 *     super('SomeRouter');
 *   }
 * }
 */

/**
 * ! lib imports
 */
import http from 'http';

/**
 * ! my imports
 */
import {
	EHttpMethod,
	AnyHttpContext,
	ControllerAction,
	EModuleType,
	HttpPath,
	MergeState,
	BeforeMiddlewareAction,
	AfterMiddlewareAction,
	FinallyMiddlewareAction,
	IRouterModule,
	RouteScope,
	IBeforeMiddlewareModule,
	IAfterMiddlewareModule,
	IFinallyMiddlewareModule,
	PathParamsOf,
	WithParams
} from '@core/types';
import { BaseModule } from '@core/base/Base.module';
import { CryptoUtils } from '@core/utils';
import { PayloadTooLargeException } from '@core/exceptions';
import { RouteConflictError } from '@core/errors';
import { SuccessResponse } from '@core/http';

type StateOfBefore<M> = M extends IBeforeMiddlewareModule<any, infer S>
	? S
	: {};

type MergeStates<Ms extends readonly unknown[]> = Ms extends [
	infer A,
	...infer R
]
	? StateOfBefore<A> & MergeStates<R>
	: {};

type AccCtx<
	C extends AnyHttpContext,
	Ms extends readonly unknown[]
> = MergeState<C, MergeStates<Ms>>;

/**
 * @description
 * Базовый абстрактный класс для всех модулей роутера приложения.
 */
export abstract class RouterModule<Base extends AnyHttpContext = AnyHttpContext>
	extends BaseModule
	implements IRouterModule
{
	protected prefix: HttpPath;
	/** Глобальные middleware — массивы уже связанных функций */
	protected globalBefore: Array<BeforeMiddlewareAction<AnyHttpContext, any>> =
		[];
	protected globalAfter: Array<AfterMiddlewareAction<AnyHttpContext>> = [];
	protected globalFinally: Array<FinallyMiddlewareAction<AnyHttpContext, any>> =
		[];

	/** Зарегистрированные маршруты (функции уже «плоские», без классов) */
	protected routes: Map<
		EHttpMethod,
		Map<
			HttpPath,
			{
				handler: ControllerAction<AnyHttpContext>;
				before: Array<BeforeMiddlewareAction<AnyHttpContext, any>>;
				after: Array<AfterMiddlewareAction<AnyHttpContext>>;
				finally: Array<FinallyMiddlewareAction<AnyHttpContext, any>>;
				pathRegex: RegExp;
				paramNames: Array<string>;
			}
		>
	> = new Map();

	protected constructor(moduleName: string, prefix: HttpPath) {
		super(EModuleType.ROUTER, moduleName);
		this.prefix = prefix;
	}

	private parseQuery(
		searchParams: URLSearchParams
	): Record<string, string | Array<string>> {
		const acc: Record<string, Array<string>> = {};

		for (const [k, v] of searchParams.entries()) {
			(acc[k] ??= []).push(v);
		}

		const out: Record<string, string | string[]> = {};
		for (const [k, arr] of Object.entries(acc)) {
			out[k] = arr.length === 1 ? arr[0]! : arr;
		}

		return out;
	}

	/**
	 * Парсит метод запроса из объекта входящего запроса.
	 *
	 * @param req Объект входящего запроса
	 * @returns Метод запроса (например, GET, POST, PUT, DELETE)
	 */
	private parseMethod(req: http.IncomingMessage): EHttpMethod {
		let method: EHttpMethod = (req.method as EHttpMethod) || EHttpMethod.GET;
		return method;
	}

	/**
	 * Парсит путь с параметрами и возвращает регулярное выражение и имена параметров.
	 *
	 * @param path Путь с параметрами (например, '/api/users/:id')
	 * @returns Объект с регулярным выражением и массивом имен параметров
	 */
	private parsePath(path: HttpPath): {
		pathRegex: RegExp;
		paramNames: Array<string>;
	} {
		const paramNames: Array<string> = [];
		const seenParamNames = new Set<string>();
		const pathRegex = new RegExp(
			'^' +
				path.replace(/\/:([^\/]+)/g, (_, paramName) => {
					if (seenParamNames.has(paramName)) {
						const err = new Error(
							`Duplicate parameter name '${paramName}' in path '${path}'`
						);
						this.fatal(
							{
								message: `Duplicate parameter name '${paramName}' in path '${path}'`,
								details: { paramName, path, error: err }
							},
							{ log: { save: false } }
						);
						throw err;
					}
					seenParamNames.add(paramName);
					paramNames.push(paramName);
					return `/(?<${paramName}>[^\\/]+)`;
				}) +
				'$'
		);
		return { pathRegex, paramNames };
	}

	/**
	 * Парсит кодировку из заголовка Content-Type.
	 *
	 * @param ct Значение заголовка Content-Type
	 * @returns Кодировка (например, 'utf-8', 'latin1', 'ascii')
	 */
	private parseCharset(ct: string | undefined): BufferEncoding {
		if (!ct) return 'utf-8';
		const m = /;\s*charset=([^;]+)/i.exec(ct);
		const cs = m?.[1]?.trim().toLowerCase();
		// маппинг к известным Node-энкодингам:
		if (cs === 'utf8' || cs === 'utf-8') return 'utf-8';
		if (cs === 'latin1' || cs === 'iso-8859-1') return 'latin1';
		if (cs === 'ascii') return 'ascii';
		// по умолчанию
		return 'utf-8';
	}

	/**
	 * Канонизация пути: ведущий '/', без двойных слэшей, без хвостового '/' (кроме корня)
	 * @param p Путь для нормализации
	 * @returns Нормализованный путь
	 */
	private normalizePath(p: string): HttpPath {
		let s = p || '/';
		s = s.replace(/\/{2,}/g, '/');
		if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
		if (!s.startsWith('/')) s = `/${s}`;
		return s as HttpPath;
	}

	/**
	 * Нормализация заголовков к lower-case ключам и string-значениям (берём первый если массив)
	 * @param src Исходный объект заголовков
	 * @returns Нормализованный объект заголовков
	 */
	private normalizeHeaders(
		src: http.IncomingHttpHeaders
	): Record<string, string> {
		const out: Record<string, string> = {};
		for (const k in src) {
			const v = src[k];
			if (Array.isArray(v)) out[k.toLowerCase()] = v[0] ?? '';
			else out[k.toLowerCase()] = v ?? '';
		}
		return out;
	}

	protected joinPaths(prefix: HttpPath, path: HttpPath): HttpPath {
		// уберём двойные слэши и сохраним ведущий '/'
		const p = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;

		let joinedPath = `${p}${path}`.replace(/\/{2,}/g, '/') as HttpPath;

		// Remove trailing slash if it's not the root path
		if (joinedPath.length > 1 && joinedPath.endsWith('/')) {
			joinedPath = joinedPath.slice(0, -1) as HttpPath;
		}

		return joinedPath;
	}

	/**
	 * ? === === === GLOBAL MIDDLEWARE === === ===
	 */

	/**
	 * Регистрация глобальных middleware перед обработкой маршрута.
	 *
	 * @param mods Массив модулей middleware, реализующих интерфейс IBeforeMiddlewareModule
	 * @returns Экземпляр роутера (для цепочки вызовов)
	 */
	public useBefore(
		...mods: Array<IBeforeMiddlewareModule<AnyHttpContext, any>>
	): this {
		this.globalBefore.push(
			...mods.map(m => {
				this.debug({
					message: `Registering before middleware: ${m.getModuleName()}`
				});
				return m.handle.bind(m);
			})
		);
		return this;
	}

	/**
	 * Регистрация глобальных middleware после обработки маршрута.
	 *
	 * @param mods Массив модулей middleware, реализующих интерфейс IAfterMiddlewareModule
	 * @returns Экземпляр роутера (для цепочки вызовов)
	 */
	public useAfter(
		...mods: Array<IAfterMiddlewareModule<AnyHttpContext>>
	): this {
		this.globalAfter.push(
			...mods.map(m => {
				this.debug({
					message: `Registering after middleware: ${m.getModuleName()}`
				});
				return m.handle.bind(m);
			})
		);
		return this;
	}

	/**
	 * Регистрация глобальных middleware, выполняющихся всегда, вне зависимости от результата обработки маршрута.
	 *
	 * @param mods Массив модулей middleware, реализующих интерфейс IFinallyMiddlewareModule
	 * @returns Экземпляр роутера (для цепочки вызовов)
	 */
	public finally(
		...mods: Array<IFinallyMiddlewareModule<AnyHttpContext, any>>
	): this {
		this.globalFinally.push(
			...mods.map(m => {
				this.debug({
					message: `Registering finally middleware: ${m.getModuleName()}`
				});

				return m.handle.bind(m);
			})
		);
		return this;
	}

	/**
	 * ? === === === ROUTE REGISTRATION === === ===
	 */

	/**
	 * Создаёт скоуп маршрута. ВОЗВРАЩАЕМЫЙ ТИП RouteScope ДОЛЖЕН БЫТЬ ДЖЕНЕРИКОМ.
	 *
	 * @param {EHttpMethod} method  HTTP-метод маршрута (GET, POST, PUT, DELETE и т.д.)
	 * @param {HttpPath} path  Путь маршрута (например, '/api/users/:id')
	 * @param {ControllerAction<Context>} handler Обработчик маршрута (функция, которая будет вызвана при совпадении пути и метода)
	 * @returns {RouteScope<Context>} Объект скоупа маршрута, который позволяет добавлять middleware и завершать маршрут
	 */
	protected createRouteScope<Context extends AnyHttpContext = Base>(
		method: EHttpMethod,
		path: HttpPath,
		handler: ControllerAction<Context>
	): RouteScope<Context> {
		const fullPath = this.joinPaths(this.prefix, path);
		const { pathRegex, paramNames } = this.parsePath(fullPath);

		// Запись в реестр с исходным AnyHttpContext-типа handler'a
		const route = {
			handler: handler as unknown as ControllerAction<AnyHttpContext>,
			before: [...this.globalBefore],
			after: [...this.globalAfter],
			finally: [...this.globalFinally],
			pathRegex,
			paramNames
		};

		/**
		 * Добавляем карту маршруток в реестр, если по данному методу еще нет
		 */
		if (!this.routes.has(method)) {
			this.routes.set(method, new Map());
		} else {
			if (this.routes.get(method)!.has(fullPath)) {
				const err = new RouteConflictError({
					method: method,
					path: fullPath,
					origin: this.getModuleName(),
					fatal: true
				});
				this.fatal(
					{
						message: `Route ${fullPath} for method ${method} already exists`,
						details: { fullPath, path, method, error: err }
					},
					{ log: { save: false } }
				);
				throw err;
			}
		}
		this.routes.get(method)!.set(fullPath, route);

		// Локальный билдер с «прокидыванием» state дальше по цепочке
		const scope = {
			useBefore: <Ms extends Array<IBeforeMiddlewareModule<Context, any>>>(
				...mods: Ms
			) => {
				route.before.push(
					...mods.map(m =>
						(m.handle as BeforeMiddlewareAction<any, any>).bind(m)
					)
				);
				type NextC = AccCtx<Context, Ms>;
				return scope as unknown as RouteScope<NextC>;
			},
			useAfter: (...mods: Array<IAfterMiddlewareModule<Context>>) => {
				route.after.push(
					...mods.map(m => (m.handle as AfterMiddlewareAction<any>).bind(m))
				);
				return scope as unknown as RouteScope<Context>;
			},
			finally: (...mods: Array<IFinallyMiddlewareModule<Context, any>>) => {
				route.finally.push(
					...mods.map(m => (m.handle as FinallyMiddlewareAction<any>).bind(m))
				);
				return scope as unknown as RouteScope<Context>;
			},
			done: () => this as unknown as IRouterModule
		};

		return scope;
	}

	/** GET */

	public get<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<AnyHttpContext, PathParamsOf<Path>>>
	): RouteScope<WithParams<AnyHttpContext, PathParamsOf<Path>>> {
		this.info({
			message: `GET route: ${this.joinPaths(this.prefix, path)}`
		});
		return this.createRouteScope<
			WithParams<AnyHttpContext, PathParamsOf<Path>>
		>(EHttpMethod.GET, path, handler);
	}

	/** POST */
	public post<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<AnyHttpContext, PathParamsOf<Path>>>
	): RouteScope<WithParams<AnyHttpContext, PathParamsOf<Path>>> {
		this.info({
			message: `POST route: ${this.joinPaths(this.prefix, path)}`
		});
		return this.createRouteScope<
			WithParams<AnyHttpContext, PathParamsOf<Path>>
		>(EHttpMethod.POST, path, handler);
	}

	/** PUT */
	public put<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<AnyHttpContext, PathParamsOf<Path>>>
	): RouteScope<WithParams<AnyHttpContext, PathParamsOf<Path>>> {
		this.info({
			message: `PUT route: ${this.joinPaths(this.prefix, path)}`
		});
		return this.createRouteScope<
			WithParams<AnyHttpContext, PathParamsOf<Path>>
		>(EHttpMethod.PUT, path, handler);
	}

	/** PATCH */
	public patch<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<AnyHttpContext, PathParamsOf<Path>>>
	): RouteScope<WithParams<AnyHttpContext, PathParamsOf<Path>>> {
		this.info({
			message: `PATCH route: ${this.joinPaths(this.prefix, path)}`
		});
		return this.createRouteScope<
			WithParams<AnyHttpContext, PathParamsOf<Path>>
		>(EHttpMethod.PATCH, path, handler);
	}

	/** DELETE */
	public delete<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<AnyHttpContext, PathParamsOf<Path>>>
	): RouteScope<WithParams<AnyHttpContext, PathParamsOf<Path>>> {
		this.info({
			message: `DELETE route: ${this.joinPaths(this.prefix, path)}`
		});
		return this.createRouteScope<
			WithParams<AnyHttpContext, PathParamsOf<Path>>
		>(EHttpMethod.DELETE, path, handler);
	}

	public mount(child: RouterModule<AnyHttpContext>): this {
		// доступ к protected допустим, т.к. мы внутри того же класса
		const childImpl = child;

		for (const [method, routesMap] of childImpl.routes) {
			for (const [path, r] of routesMap) {
				const fullPath = this.joinPaths(this.prefix, path);
				const { pathRegex, paramNames } = this.parsePath(fullPath);

				if (!this.routes.has(method)) {
					this.routes.set(method, new Map());
				}
				this.routes.get(method)!.set(fullPath, {
					handler: r.handler as ControllerAction<AnyHttpContext>,

					// порядок цепочек:
					// before: parent → child
					before: [...this.globalBefore, ...r.before],

					// after: child → parent
					after: [...r.after, ...this.globalAfter],

					// finally: child → parent
					finally: [...r.finally, ...this.globalFinally],
					pathRegex,
					paramNames
				});
			}
		}

		this.debug({
			message: `Registered child router: ${child.getModuleName()}`
		});

		return this;
	}

	/**
	 * Пытается найти маршрут по методу и пути.
	 * @param {EHttpMethod} method HTTP-метод маршрута (GET, POST, PUT, DELETE и т.д.)
	 * @param {HttpPath} pathname Путь маршрута (например, '/api/users/:id')
	 * @returns {RouteScope<Base> | undefined} Объект скоупа маршрута, если найден, иначе undefined
	 */
	public matchRoute(method: EHttpMethod, pathname: HttpPath) {
		// Пытаемся найти маршрут по методу
		const methodRoutes = this.routes.get(method);

		// Если маршрутов для метода нет, возвращаем undefined
		if (!methodRoutes) return undefined;

		for (const [path, route] of methodRoutes) {
			const match = pathname.match(route.pathRegex);
			if (match) {
				const params: Record<string, string> = {};
				if (match.groups) {
					for (const paramName of route.paramNames) {
						const v = match.groups[paramName];
						if (v) {
							params[paramName] = v;
						}
					}
				}
				return { ...route, params, path };
			}
		}
		return undefined;
	}

	/**
	 * Обработка входящего HTTP-запроса.
	 *
	 * @param {http.IncomingMessage} req Объект входящего HTTP-запроса
	 * @param {http.ServerResponse} res Объект исходящего HTTP-ответа
	 */
	public async handleRequest(
		req: http.IncomingMessage,
		res: http.ServerResponse
	) {
		/**
		 * Парсит метод запроса из объекта входящего запроса.
		 */
		const method = this.parseMethod(req);
		const rawUrl = req.url || '/';

		// Разбор URL: отделяем pathname и query
		const u = new URL(rawUrl, 'http://localhost'); // base нужен для Node
		const pathname = (u.pathname || '/') as HttpPath; // RFC-декодированный путь без query/hash
		const path = this.normalizePath(pathname); // канонический путь фреймворка
		const query = this.parseQuery(u.searchParams); // Record<string, string | string[]>
		// Генерация уникального requestId
		const requestId = CryptoUtils.genRandomString();

		// Матчинг роутов — строго по path (без query)
		const match = this.matchRoute(method, path);
		if (!match) {
			res.statusCode = 404;
			res.end('Not Found');
			return;
		}

		// Нормализация заголовков и парсинг cookies
		const headers = this.normalizeHeaders(req.headers);

		// Единый IP
		const forwardedFor = headers['x-forwarded-for'];
		let clientIp = req.socket?.remoteAddress || '';
		// Если есть X-Forwarded-For, берем первый IP
		if (forwardedFor) {
			// Берем первый IP из X-Forwarded-For
			const firstIp = forwardedFor.split(',')[0];
			if (firstIp) clientIp = firstIp.trim();
		}

		// Создание контекста запроса
		const ctx: AnyHttpContext = {
			rawReq: req,
			rawRes: res,

			method: method,
			url: rawUrl, // сырой URL как пришёл
			path, // нормализованный путь (канонический для роутера)
			pathname, // RFC pathname (если где-то пригодится)
			matchedPath: match.path, // шаблон маршрута, например '/users/:id'

			headers,
			clientIp,
			/**
			 * Cookies парсятся в CookieMiddleware.
			 */
			cookies: {},

			/**
			 * Уникальный requestId.
			 */
			requestId,
			/**
			 * Записываем время начала обработки запроса.
			 */
			startedAt: Date.now(),
			/**
			 * Сырой тело запроса (если не распарсили — null)
			 */
			rawBody: null,
			/**
			 * Размер сырого тела запроса (если не распарсили — 0)
			 */
			bodySize: null,
			/**
			 * Кодировка тела запроса (если не распарсили — 'utf-8')
			 */
			charset: this.parseCharset(req.headers['content-type'] ?? ''),

			/**
			 * Парсинг тела запроса в объект (если не распарсили — null)
			 */
			body: null,
			/**
			 * Парсинг параметров пути (например, /users/:id)
			 */
			params: match.params,
			/**
			 * Парсинг query-параметров (например, ?key=value)
			 */
			query,
			/**
			 * Накопительное состояние от middleware
			 */
			state: {},

			/**
			 * Хелперы ответа
			 */
			reply: {
				/**
				 * Устанавливает HTTP-статус код ответа,
				 * а также JSON-ответ с данными из SuccessResponse.
				 */
				fromApiResponse: (response: SuccessResponse<any>) => {
					ctx.reply.status(response.getStatusCode()).json(response.toJSON());
					return ctx.reply;
				},
				/**
				 * Устанавливает HTTP-статус код ответа.
				 */
				status: (code: number) => {
					res.statusCode = code;
					return ctx.reply;
				},
				/**
				 * Устанавливает заголовок ответа.
				 */
				set: (name: string, value: string) => {
					res.setHeader(name, value);
					return ctx.reply;
				},
				/**
				 * Устанавливает JSON-ответ.
				 */
				json: (data: unknown) => {
					const buf = Buffer.from(JSON.stringify(data));
					/**
					 * Устанавливаем Content-Type в application/json.
					 */
					res.setHeader('Content-Type', 'application/json');
					/**
					 * Устанавливаем Content-Length.
					 */
					res.setHeader('Content-Length', String(buf.byteLength));
					/**
					 * Устанавливаем X-Response-Time.
					 */
					res.setHeader('X-Response-Time', `${Date.now() - ctx.startedAt}`);
					res.end(buf);
				},
				/**
				 * Устанавливает текстовый ответ.
				 */
				text: (data: string) => {
					/**
					 * Устанавливаем Content-Type в text/plain.
					 */
					res.setHeader('Content-Type', 'text/plain; charset=utf-8');
					const buf = Buffer.from(data, 'utf8');
					/**
					 * Устанавливаем Content-Length.
					 */
					res.setHeader('Content-Length', String(buf.byteLength));
					/**
					 * Устанавливаем X-Response-Time.
					 */
					res.setHeader(
						'X-Response-Time',
						`${new Date().getTime() - ctx.startedAt}`
					);
					res.end(buf);
				},
				send: (data: string | Uint8Array | ArrayBuffer) => {
					const buf =
						typeof data === 'string'
							? Buffer.from(data, 'utf8')
							: data instanceof Uint8Array
							? Buffer.from(data)
							: Buffer.from(data);
					/**
					 * Устанавливаем Content-Length.
					 */
					res.setHeader('Content-Length', String(buf.byteLength));
					/**
					 * Устанавливаем X-Response-Time.
					 */
					res.setHeader(
						'X-Response-Time',
						`${new Date().getTime() - ctx.startedAt}`
					);
					res.end(buf);
				}
			}
		};

		/**
		 * Устанавливаем X-Request-Id в заголовки ответа
		 */
		ctx.reply.set('X-Request-Id', requestId);

		let caughtError: unknown;

		try {
			// before
			for (const middleware of match.before) {
				await middleware(ctx as any, async nextCtx => {
					Object.assign(ctx, nextCtx);
					return Promise.resolve();
				});
			}

			// controller
			await match.handler(ctx as any);

			// after
			for (const mw of match.after) {
				await mw(ctx as any);
			}
		} catch (e) {
			caughtError = e;
		} finally {
			for (const fin of match.finally) {
				try {
					await fin(ctx as any, caughtError as Error | undefined);
				} catch {}
			}
		}
	}

	/**
	 * Возвращает список всех зарегистрированных маршрутов с методом и путём.
	 *
	 * @returns Список всех зарегистрированных маршрутов с методом и путём.
	 */
	public listRoutes(): Array<{ method: EHttpMethod; path: string }> {
		const routesList: Array<{ method: EHttpMethod; path: string }> = [];
		for (const [method, routesMap] of this.routes) {
			for (const [path] of routesMap) {
				routesList.push({ method, path });
			}
		}
		return routesList;
	}
}
