/**
 * @file ServiceModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс базового сервисного модуля.
 *
 * @extends IBaseModule
 *
 * @see EModuleType
 * @see ICoreModule
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
import { IBaseModule } from '@core/types/modules/BaseModule';

/**
 * Интерфейс базового сервисного модуля ядра
 */
export interface IServiceModule<ModuleName extends string = string>
	extends IBaseModule<ModuleName> {}
