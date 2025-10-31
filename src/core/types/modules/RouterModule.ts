/**
 * @file RouterModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс модуля роутера.
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types/modules/ModuleType';
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
export interface IRouterModule<
	ModuleName extends string = string,
	Base extends AnyHttpContext = AnyHttpContext
> extends IBaseModule<ModuleName, EModuleType.ROUTER> {
	useBefore: (...fns: Array<IBeforeMiddlewareModule<any, Base, any>>) => this;
	useAfter: (...fns: Array<IAfterMiddlewareModule<any, Base>>) => this;
	finally: (...fns: Array<IFinallyMiddlewareModule<any, Base, any>>) => this;

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
	mount(child: IRouterModule<any, Base>): this;
}

/**
 * @description
 * Возвращаемый билдер для конкретного маршрута
 */
export interface RouteScope<Content extends AnyHttpContext> {
	useBefore: <Ms extends Array<IBeforeMiddlewareModule<any, Content, any>>>(
		...mods: Ms
	) => RouteScope<MergeState<Content, MergeStates<Ms>>>;
	useAfter: (
		...mods: Array<IAfterMiddlewareModule<any, Content>>
	) => RouteScope<Content>;
	finally: (
		...mods: Array<IFinallyMiddlewareModule<any, Content, any>>
	) => RouteScope<Content>;
	done: () => IRouterModule<any, Content>;
}

// и добавь туда те же helper-типы:
type StateOfBefore<M> = M extends IBeforeMiddlewareModule<any, any, infer S>
	? S
	: {};
type MergeStates<Ms extends readonly unknown[]> = Ms extends [
	infer A,
	...infer R
]
	? StateOfBefore<A> & MergeStates<R>
	: {};
