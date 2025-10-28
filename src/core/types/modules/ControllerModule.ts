/**
 * @file ControllerModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс модуля контроллера.
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types/modules/ModuleType';
import { IBaseModule } from '@core/types/modules/BaseModule';

/**
 * Интерфейс модуля контроллера.
 */
export interface IControllerModule<ModuleName extends string = string>
	extends IBaseModule<ModuleName, EModuleType.CONTROLLER> {}
