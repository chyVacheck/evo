/**
 * @file Service.module.ts
 * @module core/base
 *
 * @description
 * Базовый абстрактный класс для всех сервисных модулей приложения.
 *
 * @see EModuleType
 *
 * @example
 * ```ts
 * class UserService extends ServiceModule {
 *   constructor() {
 *     super(UserService.name);
 *   }
 * }
 * ```
 */

/**
 * ! my imports
 */
import { EModuleType, IServiceModule } from '@core/types';
import { BaseModule } from '@core/base/Base.module';

/**
 * Абстрактный класс, описывающий базовые свойства всех сервисных модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class ServiceModule
	extends BaseModule
	implements IServiceModule
{
	/**
	 * Базовый конструктор Service-модуля.
	 *
	 * @param moduleName - Название модуля
	 */
	constructor(moduleName: string) {
		super(EModuleType.SERVICE, moduleName);
	}
}
