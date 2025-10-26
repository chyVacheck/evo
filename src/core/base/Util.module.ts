/**
 * @file Util.module.ts
 * @module core/base
 *
 * @description
 * Абстрактный базовый класс для всех Util-компонентов приложения.
 *
 * Основные задачи:
 * - Хранение типа модуля ({@link EModuleType.UTIL}) для целей логирования и структурирования проекта
 *
 * @see EModuleType
 * @see CoreModule
 *
 * @example
 * class SomeCustomUtilModule extends BaseUtil {
 *   constructor() {
 *     super(SomeCustomUtilModule.name);
 *   }
 * }
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types';
import { CoreModule } from '@core/base/Core.module';
import { IUtilModule } from '@core/types';

/**
 * Абстрактный базовый класс для утилитарных классов.
 */
export abstract class BaseUtil<ModuleName extends string = string>
	extends CoreModule<ModuleName, EModuleType.UTIL>
	implements IUtilModule<ModuleName, EModuleType.UTIL>
{
	/**
	 * Конструктор базового Util.
	 * Устанавливает тип модуля как {@link EModuleType.UTIL}
	 *
	 * @param {ModuleName} moduleName название класса, представляющий модуль
	 */
	protected constructor(moduleName: ModuleName) {
		super(EModuleType.UTIL, moduleName);
	}
}
