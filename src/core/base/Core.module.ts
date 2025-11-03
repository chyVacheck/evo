/**
 * @file Core.module.ts
 * @module core/base
 *
 * @description
 * Базовый абстрактный класс для всех модулей приложения.
 * Представляет собой фундамент, от которого наследуется, как системные, так и прикладные модули.
 *
 * Основные задачи:
 * - Хранение типа и имени модуля
 * - Предоставление лог-контекста (используется в логгере)
 *
 * Наследуется классами `BaseModule`, `BaseUtils`
 *
 * @see EModuleType
 *
 * @example
 * class SomeCustomModule extends CoreModule {
 *   constructor() {
 *     super(EModuleType.SERVICE, 'SomeService');
 *   }
 * }
 */

/**
 * ! my imports
 */
import { EModuleType, ICoreModule } from '@core/types';

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class CoreModule<ModuleName extends string = string>
	implements ICoreModule<ModuleName>
{
	/** Тип модуля (например, SYSTEM, SERVICE, ROUTER и т.д.) */
	private moduleType: EModuleType;

	/** Имя модуля (используется в логах и отладке) */
	private readonly moduleName: ModuleName;

	/**
	 * Базовый конструктор Core-модуля.
	 *
	 * @param moduleType - Тип модуля
	 * @param moduleName - Название модуля
	 */
	protected constructor(moduleType: EModuleType, moduleName: ModuleName) {
		const trimmedModuleName = moduleName.trim();

		if (!trimmedModuleName) {
			throw new Error(
				`[CoreModule] Module name is required for type: ${moduleType}`
			);
		}

		this.moduleType = moduleType;
		this.moduleName = trimmedModuleName as ModuleName;
	}

	/**
	 * Возвращает название модуля
	 *
	 * @returns {ModuleName} Название модуля
	 */
	public getModuleName(): ModuleName {
		return this.moduleName;
	}

	/**
	 * Возвращает тип модуля.
	 * Используется для внешней идентификации модуля или фильтрации по типу.
	 *
	 * @returns {EModuleType} Тип модуля
	 */
	public getModuleType(): EModuleType {
		return this.moduleType;
	}

	/**
	 * Устанавливает тип модуля.
	 * Используется для внешней идентификации модуля или фильтрации по типу.
	 *
	 * @param moduleType - Тип модуля
	 */
	protected setModuleType(moduleType: EModuleType): void {
		this.moduleType = moduleType;
	}
}
