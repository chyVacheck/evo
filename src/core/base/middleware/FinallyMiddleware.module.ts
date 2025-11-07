/**
 * @file FinallyMiddleware.module.ts
 * @module core/base
 *
 * @description Базовый класс для finally-middleware (выполняются всегда, в т.ч. при ошибках).
 *
 * @see EModuleType
 *
 * @example
 * class SomeCustomMiddleware extends FinallyMiddlewareModule {
 *   constructor() {
 *     super('SomeMiddleware');
 *   }
 *   abstract handle(ctx: CIn, error?: Error): Promise<void> | void;
 * }
 */

/**
 * ! my imports
 */
import { AnyHttpContext, IFinallyMiddlewareModule } from '@core/types';
import { MiddlewareModule } from '@core/base/middleware/BaseMiddleware.module';

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class FinallyMiddlewareModule<
		Context extends AnyHttpContext = AnyHttpContext,
		ErrorType extends Error = Error
	>
	extends MiddlewareModule
	implements IFinallyMiddlewareModule<Context, ErrorType>
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
	 * Выполняется всегда, вне зависимости от ошибок или факта отправки ответа.
	 * Подходит для очистки ресурсов, метрик, финального логирования.
	 */
	abstract handle(ctx: Context, error?: ErrorType): Promise<void> | void;
}
