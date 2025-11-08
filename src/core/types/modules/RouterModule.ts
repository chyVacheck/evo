/**
 * @file RouterModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс модуля роутера.
 */

/**
 * ! my imports
 */
import { IBaseModule } from '@core/types/modules/BaseModule';
import {
	AnyHttpContext,
	ControllerAction,
	HttpPath,
	MergeState,
	PathParamsOf,
	WithParams
} from '@core/types/http';
import {
	IAfterMiddlewareModule,
	IBeforeMiddlewareModule,
	IFinallyMiddlewareModule
} from '@core/types/modules/middleware';

/**
 * @description
 * Интерфейс модуля роутера.
 */
export interface IRouterModule<Base extends AnyHttpContext = AnyHttpContext>
	extends IBaseModule {
	useBefore: (
		...fns: Array<IBeforeMiddlewareModule<AnyHttpContext, any>>
	) => this;
	useAfter: (...fns: Array<IAfterMiddlewareModule<AnyHttpContext>>) => this;
	finally: (
		...fns: Array<IFinallyMiddlewareModule<AnyHttpContext, any>>
	) => this;

	/**
	 * @description
	 * Регистрация маршрута для метода GET.
	 */
	get<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<Base, PathParamsOf<Path>>>
	): RouteScope<WithParams<Base, PathParamsOf<Path>>>;

	/**
	 * @description
	 * Регистрация маршрута для метода POST.
	 */
	post<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<Base, PathParamsOf<Path>>>
	): RouteScope<WithParams<Base, PathParamsOf<Path>>>;

	/**
	 * @description
	 * Регистрация маршрута для метода PUT.
	 */
	put<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<Base, PathParamsOf<Path>>>
	): RouteScope<WithParams<Base, PathParamsOf<Path>>>;
	/**
	 * @description
	 * Регистрация маршрута для метода PATCH.
	 */
	patch<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<Base, PathParamsOf<Path>>>
	): RouteScope<WithParams<Base, PathParamsOf<Path>>>;
	/**
	 * @description
	 * Регистрация маршрута для метода DELETE.
	 */
	delete<Path extends HttpPath>(
		path: Path,
		handler: ControllerAction<WithParams<Base, PathParamsOf<Path>>>
	): RouteScope<WithParams<Base, PathParamsOf<Path>>>;

	/** Вложить дочерний роутер под префикс */
	mount(child: IRouterModule<Base>): this;
}

/**
 * @description
 * Возвращаемый билдер для конкретного маршрута
 */
export interface RouteScope<Content extends AnyHttpContext> {
	useBefore: <Ms extends Array<IBeforeMiddlewareModule<Content, any>>>(
		...mods: Ms
	) => RouteScope<MergeState<Content, MergeStates<Ms>>>;
	useAfter: (
		...mods: Array<IAfterMiddlewareModule<Content>>
	) => RouteScope<Content>;
	finally: (
		...mods: Array<IFinallyMiddlewareModule<Content, any>>
	) => RouteScope<Content>;
	done: () => IRouterModule<Content>;
}

// и добавь туда те же helper-типы:
type StateOfBefore<M> = M extends IBeforeMiddlewareModule<any, infer S>
	? S
	: {};
type MergeStates<Ms extends readonly unknown[]> = Ms extends [
	infer A,
	...infer R
]
	? StateOfBefore<A> & MergeStates<R>
	: {};
