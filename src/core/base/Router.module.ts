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
	protected routes: Array<{
		method: EHttpMethod;
		path: HttpPath;
		handler: ControllerAction<Base>;
		before: Array<BeforeMiddlewareAction<Base, any>>;
		after: Array<AfterMiddlewareAction<Base>>;
		finally: Array<FinallyMiddlewareAction<Base>>;
	}> = [];

	protected constructor(moduleName: ModuleName, prefix: HttpPath) {
		super(EModuleType.ROUTER, moduleName);
		this.prefix = prefix;
	}

	protected joinPaths(prefix: HttpPath, path: HttpPath): HttpPath {
		// уберём двойные слэши и сохраним ведущий '/'
		const p = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
		return `${p}${path}`.replace(/\/{2,}/g, '/') as HttpPath;
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
		// Запись в реестр с исходным Base-типа handler'a
		const route = {
			method,
			path: this.joinPaths(this.prefix, path),
			handler: handler as unknown as ControllerAction<Base>,
			before: [...this.globalBefore],
			after: [...this.globalAfter],
			finally: [...this.globalFinally]
		};

		this.routes.push(route);

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

	public mount(
		child: IRouterModule<any, Base> | RouterModule<any, Base>
	): this {
		// доступ к protected допустим, т.к. мы внутри того же класса
		const childImpl = child as RouterModule<any, Base>;

		for (const r of childImpl.routes) {
			this.routes.push({
				method: r.method,
				path: this.joinPaths(this.prefix, r.path),
				handler: r.handler as ControllerAction<Base>,

				// порядок цепочек:
				// before: parent → child
				before: [...this.globalBefore, ...r.before],

				// after: child → parent
				after: [...r.after, ...this.globalAfter],

				// finally: child → parent
				finally: [...r.finally, ...this.globalFinally]
			});
		}

		return this;
	}

	/**
	 * ? === === === Debug === === ===
	 */

	public listRoutes(): Array<{ method: EHttpMethod; path: string }> {
		return this.routes.map(r => ({ method: r.method, path: r.path }));
	}
}
