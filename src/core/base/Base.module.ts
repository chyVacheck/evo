/**
 * @file BaseModule.ts
 * @module core/base
 *
 * @description
 * Абстрактный базовый класс для модулей приложения, предоставляющий:
 * - Логгирование с автоматической привязкой к модулю;
 * - Стандартизированный интерфейс для отладки и трассировки;
 * - Явное указание типа модуля (например, SYSTEM, UTILITY, FEATURE).
 *
 * Используется для наследования другими модулями в рамках `CoreModule`.
 *
 * @extends CoreModule
 *
 * @see Logger
 * @see ConsolePrintOptions
 * @see ELogLevel
 * @see EModuleType
 * @see ILog
 * @see LogOptions
 * @see CoreModule
 */

/**
 * ! my imports
 */
import { Logger } from '@core/logger';
import {
	ConsolePrintOptions,
	ELogLevel,
	EModuleType,
	ILog,
	LogOptions
} from '@core/types';
import { CoreModule } from '@core/base/Core.module';
import { IBaseModule } from '@core/types/modules';

type BaseModuleLog = Omit<
	ILog,
	'level' | 'createdAt' | 'moduleName' | 'moduleType'
>;

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class BaseModule extends CoreModule implements IBaseModule {
	/**
	 * Базовый конструктор Core-модуля.
	 *
	 * @param moduleType - Тип модуля
	 * @param moduleName - Название модуля
	 */
	protected constructor(moduleType: EModuleType, moduleName: string) {
		super(moduleType, moduleName);
	}

	/**
	 * ? === === === LOGGER METHODS === === ===
	 */

	/**
	 * Универсальный метод логирования с автоматической привязкой к модулю.
	 */
	protected log(
		level: ELogLevel,
		data: BaseModuleLog,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		Logger.fromModule(this, level, data, ops);
	}

	/**
	 * Лог уровня DEBUG
	 */
	protected debug(
		data: BaseModuleLog,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.DEBUG, data, ops);
	}

	/**
	 * Лог уровня INFO (по умолчанию не сохраняется в файл)
	 */
	protected info(
		data: BaseModuleLog,

		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		const save = ops?.log?.save ?? false; // по умолчанию не сохраняем
		this.log(ELogLevel.INFO, data, { ...ops, log: { save } });
	}

	/**
	 * Лог уровня WARN
	 */
	protected warn(
		data: BaseModuleLog,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.WARN, data, ops);
	}

	/**
	 * Лог уровня ERROR
	 */
	protected error(
		data: BaseModuleLog,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.ERROR, data, ops);
	}

	/**
	 * Лог уровня FATAL
	 */
	protected fatal(
		data: BaseModuleLog,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.FATAL, data, ops);
	}
}
