/**
 * @file Repository.module.ts
 * @module core/base
 *
 * @description
 * Базовый абстрактный класс для всех репозиторий модулей приложения.
 *
 * @see EModuleType
 *
 * @example
 * ```ts
 * class UserRepository extends RepositoryModule {
 *   constructor() {
 *     super(UserRepository.name);
 *   }
 * }
 * ```
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types';
import { BaseModule } from '@core/base/Base.module';

/**
 * Абстрактный класс репозитория.
 *
 * @typeParam ModuleName - Имя модуля (литеральная строка).
 */
export abstract class RepositoryModule extends BaseModule {
	/**
	 * Базовый конструктор Repository-модуля.
	 * @param moduleName - Название модуля
	 */
	constructor(moduleName: string) {
		super(EModuleType.REPOSITORY, moduleName);
	}
}

