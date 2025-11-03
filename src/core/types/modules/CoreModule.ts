/**
 * @file CoreModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс модуля ядра.
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types/modules/ModuleType';

export type ICoreModule<ModuleName extends string = string> = {
	/**
	 * Возвращает название модуля
	 */
	getModuleName: () => ModuleName;

	/**
	 * Возвращает тип модуля
	 */
	getModuleType: () => EModuleType;
};
