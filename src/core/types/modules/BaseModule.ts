/**
 * @file CoreModule.interface.ts
 * @module core/types/modules
 * @description
 * Интерфейс базового модуля.
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types/modules/ModuleType';
import { ICoreModule } from '@core/types/modules/CoreModule';

/**
 * Интерфейс базового модуля ядра
 */
export interface IBaseModule<
	ModuleName extends string = string,
	ModuleType extends EModuleType = EModuleType
> extends ICoreModule<ModuleName, ModuleType> {}
