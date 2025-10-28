/**
 * @file Middleware.ts
 * @module core/types/http
 * @description Тип промежуточного обработчика (middleware)
 */

/**
 * ! my imports
 */
import { AnyHttpContext, MergeState } from '@core/types/http/context';

/**
 * @description
 * Метод before middleware: принимает ctx и next(ctx'), добавляет к state Add
 */
export type BeforeMiddlewareAction<
	Context extends AnyHttpContext,
	Add extends object = {}
> = (
	ctx: Context,
	next: (ctx: MergeState<Context, Add>) => Promise<void>
) => Promise<void>;

/**
 * @description
 * Метод after middleware: принимает ctx, не вызывает next, просто пост-логика
 */
export type AfterMiddlewareAction<
	Context extends AnyHttpContext = AnyHttpContext
> = (ctx: Context) => Promise<void> | void;

/**
 * @description
 * Метод finally middleware: всегда, даже при ошибках/раннем send
 */
export type FinallyMiddlewareAction<
	Context extends AnyHttpContext = AnyHttpContext,
	ErrorType extends Error = Error
> = (ctx: Context, error?: ErrorType) => Promise<void> | void;

/**
 * @description
 * Типобезопасный кортеж middleware с поэтапной прокидкой state
 */
export type MiddlewareChain<
	C0 extends AnyHttpContext,
	Adds extends object[]
> = Adds extends []
	? []
	: Adds extends [infer A extends object, ...infer R extends object[]]
	? [BeforeMiddlewareAction<C0, A>, ...MiddlewareChain<MergeState<C0, A>, R>]
	: never;

/**
 * @description
 * Финальный контекст после цепочки Adds
 */
export type ComposeState<
	C0 extends AnyHttpContext,
	Adds extends ReadonlyArray<object>
> = Adds extends [infer A extends object, ...infer R extends object[]]
	? ComposeState<MergeState<C0, A>, R>
	: C0;
