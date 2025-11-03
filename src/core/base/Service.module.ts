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
 * class SomeCustomModule extends ServiceModule {
 *   constructor() {
 *     super(EModuleType.SERVICE, 'SomeService');
 *   }
 * }
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
export abstract class ServiceModule<ModuleName extends string = string>
	extends BaseModule<ModuleName>
	implements IServiceModule<ModuleName>
{
	/**
	 * Базовый конструктор Service-модуля.
	 *
	 * @param moduleName - Название модуля
	 */
	constructor(moduleName: ModuleName) {
		super(EModuleType.SERVICE, moduleName);
	}
}
