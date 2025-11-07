/**
 * @file BaseMiddleware.module.ts
 * @module core/base
 *
 * @description Базовый абстрактный класс для всех модулей middleware приложения.
 *
 * @see EModuleType
 *
 * @example
 * class SomeCustomMiddleware extends MiddlewareModule {
 *   constructor() {
 *     super('SomeMiddleware');
 *   }
 * }
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types';
import { BaseModule } from '@core/base/Base.module';

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class MiddlewareModule extends BaseModule {
	/**
	 * Базовый конструктор Middleware-модуля.
	 *
	 * @param {string} moduleName - Название модуля
	 */
	protected constructor(moduleName: string) {
		super(EModuleType.MIDDLEWARE, moduleName);
	}
}
