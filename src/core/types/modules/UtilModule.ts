/**
 * @file UtilModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс модуля утилиты.
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types/modules/ModuleType';
import { ICoreModule } from '@core/types/modules/CoreModule';

export interface IUtilModule<
	ModuleName extends string = string,
	ModuleType extends EModuleType = EModuleType
> extends ICoreModule<ModuleName, ModuleType> {}
