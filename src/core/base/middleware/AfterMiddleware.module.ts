/**
 * @file AfterMiddleware.module.ts
 * @module core/base
 *
 * @description Базовый класс для after-middleware (выполняются после контроллера, если ошибок не было).
 *
 * @see EModuleType
 *
 * @example
 * class SomeCustomMiddleware extends AfterMiddlewareModule {
 *   constructor() {
 *     super('SomeMiddleware');
 *   }
 *   abstract after(ctx: CIn): Promise<void> | void;
 * }
 */

/**
 * ! my imports
 */
import {
	AnyHttpContext,
	AfterMiddlewareAction,
	IAfterMiddlewareModule
} from '@core/types';
import { MiddlewareModule } from '@core/base/middleware/BaseMiddleware.module';

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class AfterMiddlewareModule<
		CIn extends AnyHttpContext = AnyHttpContext
	>
	extends MiddlewareModule
	implements IAfterMiddlewareModule<CIn>
{
	/**
	 * Базовый конструктор Middleware-модуля.
	 *
	 * @param {string} moduleName - Название модуля
	 */
	protected constructor(moduleName: string) {
		super(moduleName);
	}

	/**
	 * Выполняется после успешного выполнения контроллера.
	 * Не вызывает `next`, используется для пост-логики: заголовки, кэш, аудит и т.д.
	 */
	abstract handle: AfterMiddlewareAction<CIn>;
}
