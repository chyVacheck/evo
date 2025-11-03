/**
 * @file UtilModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс модуля утилиты.
 */

/**
 * ! my imports
 */
import { ICoreModule } from '@core/types/modules/CoreModule';

export interface IUtilModule<ModuleName extends string = string>
	extends ICoreModule<ModuleName> {}
