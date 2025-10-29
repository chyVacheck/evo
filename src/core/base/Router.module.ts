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
	IFinallyMiddlewareModule
} from '@core/types';
import { BaseModule } from '@core/base/Base.module';
import { CryptoUtils } from '@core/utils';

type StateOfBefore<M> = M extends IBeforeMiddlewareModule<any, any, infer S>
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
export abstract class RouterModule<
		ModuleName extends string = string,
		Base extends AnyHttpContext = AnyHttpContext
	>
	extends BaseModule<ModuleName, EModuleType.ROUTER>
	implements IRouterModule<ModuleName, Base>
{
	protected prefix: HttpPath;
	/** Глобальные middleware — массивы уже связанных функций */
	protected globalBefore: Array<BeforeMiddlewareAction<Base, any>> = [];
	protected globalAfter: Array<AfterMiddlewareAction<Base>> = [];
	protected globalFinally: Array<FinallyMiddlewareAction<Base>> = [];

	/** Зарегистрированные маршруты (функции уже «плоские», без классов) */
	protected routes: Map<
		EHttpMethod,
		Map<
			HttpPath,
			{
				handler: ControllerAction<Base>;
				before: Array<BeforeMiddlewareAction<Base, any>>;
				after: Array<AfterMiddlewareAction<Base>>;
				finally: Array<FinallyMiddlewareAction<Base>>;
				pathRegex: RegExp;
				paramNames: Array<string>;
			}
		>
	> = new Map();

	protected constructor(moduleName: ModuleName, prefix: HttpPath) {
		super(EModuleType.ROUTER, moduleName);
		this.prefix = prefix;
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
	 * Парсит путь с параметрами и возвращает регулярное выражение и имена параметров.
	 *
	 * @param path Путь с параметрами (например, '/api/users/:id')
	 * @returns Объект с регулярным выражением и массивом имен параметров
	 */
	protected parsePath(path: HttpPath): {
		pathRegex: RegExp;
		paramNames: Array<string>;
	} {
		const paramNames: Array<string> = [];
		const seenParamNames = new Set<string>();
		const pathRegex = new RegExp(
			'^' +
				path.replace(/\/:([^\/]+)/g, (_, paramName) => {
					if (seenParamNames.has(paramName)) {
						this.fatal(
							`Duplicate parameter name '${paramName}' in path '${path}'`,
							{ details: { paramName, path } },
							{ log: { save: false } }
						);
						throw new Error(
							`Duplicate parameter name '${paramName}' in path '${path}'`
						);
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
	 * ? === === === GLOBAL MIDDLEWARE === === ===
	 */

	public useBefore(
		...mods: Array<IBeforeMiddlewareModule<any, Base, any>>
	): this {
		this.globalBefore.push(...mods.map(m => m.handle.bind(m)));
		return this;
	}

	public useAfter(...mods: Array<IAfterMiddlewareModule<any, Base>>): this {
		this.globalAfter.push(...mods.map(m => m.handle.bind(m)));
		return this;
	}

	public finally(
		...mods: Array<IFinallyMiddlewareModule<any, Base, any>>
	): this {
		this.globalFinally.push(...mods.map(m => m.handle.bind(m)));
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

		// Запись в реестр с исходным Base-типа handler'a
		const route = {
			handler: handler as unknown as ControllerAction<Base>,
			before: [...this.globalBefore],
			after: [...this.globalAfter],
			finally: [...this.globalFinally],
			pathRegex,
			paramNames
		};

		/**
		 * Добавляем карту маршруток в реестр, если по данному методу еще
		 */
		if (!this.routes.has(method)) {
			this.routes.set(method, new Map());
		}
		this.routes.get(method)!.set(fullPath, route);

		// Локальный билдер с «прокидыванием» state дальше по цепочке
		const scope = {
			useBefore: <Ms extends Array<IBeforeMiddlewareModule<any, Context, any>>>(
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
			useAfter: (...mods: Array<IAfterMiddlewareModule<any, Context>>) => {
				route.after.push(
					...mods.map(m => (m.handle as AfterMiddlewareAction<any>).bind(m))
				);
				return scope as unknown as RouteScope<Context>;
			},
			finally: (
				...mods: Array<IFinallyMiddlewareModule<any, Context, any>>
			) => {
				route.finally.push(
					...mods.map(m => (m.handle as FinallyMiddlewareAction<any>).bind(m))
				);
				return scope as unknown as RouteScope<Context>;
			},
			done: () => this as unknown as IRouterModule<any, Context>
		};

		return scope;
	}

	/** GET */
	public get(
		path: HttpPath,
		handler: ControllerAction<Base>
	): RouteScope<Base> {
		return this.createRouteScope<Base>(EHttpMethod.GET, path, handler);
	}

	/** POST */
	public post(
		path: HttpPath,
		handler: ControllerAction<Base>
	): RouteScope<Base> {
		return this.createRouteScope<Base>(EHttpMethod.POST, path, handler);
	}

	/** PUT */
	public put(
		path: HttpPath,
		handler: ControllerAction<Base>
	): RouteScope<Base> {
		return this.createRouteScope<Base>(EHttpMethod.PUT, path, handler);
	}

	/** PATCH */
	public patch(
		path: HttpPath,
		handler: ControllerAction<Base>
	): RouteScope<Base> {
		return this.createRouteScope<Base>(EHttpMethod.PATCH, path, handler);
	}

	/** DELETE */
	public delete(
		path: HttpPath,
		handler: ControllerAction<Base>
	): RouteScope<Base> {
		return this.createRouteScope<Base>(EHttpMethod.DELETE, path, handler);
	}

	public mount(child: RouterModule<any, Base>): this {
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
					handler: r.handler as ControllerAction<Base>,

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

		return this;
	}

	/**
	 * Пытается найти маршрут по методу и пути.
	 *
	 * @param {EHttpMethod} method HTTP-метод маршрута (GET, POST, PUT, DELETE и т.д.)
	 * @param {HttpPath} path Путь маршрута (например, '/api/users/:id')
	 * @returns {RouteScope<Base> | undefined} Объект скоупа маршрута, если найден, иначе undefined
	 */
	public matchRoute(
		method: EHttpMethod,
		url: HttpPath
	):
		| undefined
		| {
				path: HttpPath;
				handler: ControllerAction<Base>;
				before: Array<BeforeMiddlewareAction<Base, any>>;
				after: Array<AfterMiddlewareAction<Base>>;
				finally: Array<FinallyMiddlewareAction<Base>>;
				params: Record<string, string>;
		  } {
		// Пытаемся найти маршрут по методу
		const methodRoutes = this.routes.get(method);

		// Если маршрутов для метода нет, возвращаем undefined
		if (!methodRoutes) {
			return undefined;
		}

		for (const [path, route] of methodRoutes) {
			const match = url.match(route.pathRegex);
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

	public async handleRequest(
		req: http.IncomingMessage,
		res: http.ServerResponse
	) {
		const method: EHttpMethod = (req.method as EHttpMethod) || EHttpMethod.GET;

		console.log(req.url);
		const url = req.url || '/';

		const match = this.matchRoute(method, url as HttpPath);

		if (!match) {
			res.statusCode = 404;
			res.end('Not Found');
			return;
		}

		const ctx: AnyHttpContext = {
			rawReq: req,
			rawRes: res,

			method,
			url,
			path: url as HttpPath,
			pathname: url as HttpPath, // todo

			headers: {}, //req.headers,
			clientIp: req.socket.remoteAddress || '',
			cookies: {}, // req.headers.cookie || '',

			matchedPath: match.path, //

			/**
			 * Генерируем уникальный requestId.
			 */
			requestId: CryptoUtils.genRandomString(),
			/**
			 * Записываем время начала обработки запроса.
			 */
			startedAt: Date.now(),

			params: match.params,
			query: {},
			body: {},
			state: {},
			reply: {
				status: (code: number) => {
					res.statusCode = code;
					return ctx.reply;
				},
				json: (data: any) => res.end(JSON.stringify(data)),
				text: (data: string) => res.end(data),
				send: (data: any) => res.end(data),
				set: (name: string, value: string) => {
					res.setHeader(name, value);
					return ctx.reply;
				}
			}
		};

		let error: unknown;

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
			error = e;
			res.statusCode = 500;
			res.end('Internal Server Error');
		} finally {
			for (const fin of match.finally) {
				try {
					await fin(ctx as any, error as Error | undefined);
				} catch {}
			}
		}
	}

	/**
	 * ? === === === Debug === === ===
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
