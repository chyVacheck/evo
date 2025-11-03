/**
 * @file CoreModule.interface.ts
 * @module core/types/modules
 * @description
 * Интерфейс базового модуля.
 */

/**
 * ! my imports
 */
import { ICoreModule } from '@core/types/modules/CoreModule';

/**
 * Интерфейс базового модуля ядра
 */
export interface IBaseModule<ModuleName extends string = string>
	extends ICoreModule<ModuleName> {}
