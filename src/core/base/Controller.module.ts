/**
 * @file Controller.module.ts
 * @module core/base
 *
 * @description
 * Базовый абстрактный класс для всех модулей controller приложения.
 *
 * @see EModuleType.CONTROLLER
 */

/**
 * ! my imports
 */
import { EModuleType, IControllerModule } from '@core/types';
import { BaseModule } from '@core/base/Base.module';

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class ControllerModule
	extends BaseModule
	implements IControllerModule
{
	/**
	 * Базовый конструктор Controller-модуля.
	 *
	 * @param moduleName - Название модуля
	 */
	protected constructor(moduleName: string) {
		super(EModuleType.CONTROLLER, moduleName);
	}
}
