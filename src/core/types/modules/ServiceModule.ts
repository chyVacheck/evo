/**
 * @file ServiceModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс базового сервисного модуля.
 *
 * @extends IBaseModule
 *
 * @see EModuleType
 * @see IBaseModule
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
export interface IServiceModule extends IBaseModule {}
