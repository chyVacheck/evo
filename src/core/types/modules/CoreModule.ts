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

export type ICoreModule = {
	/**
	 * Возвращает название модуля
	 */
	getModuleName: () => string;

	/**
	 * Возвращает тип модуля
	 */
	getModuleType: () => EModuleType;
};
