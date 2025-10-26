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

/**
 * Абстрактный класс, описывающий базовые свойства всех модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class BaseModule<
		ModuleName extends string = string,
		ModuleType extends EModuleType = EModuleType
	>
	extends CoreModule<ModuleName, ModuleType>
	implements IBaseModule<ModuleName, ModuleType>
{
	/**
	 * Базовый конструктор Core-модуля.
	 *
	 * @param moduleType - Тип модуля
	 * @param moduleName - Название модуля
	 */
	protected constructor(moduleType: ModuleType, moduleName: ModuleName) {
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
		data: Omit<ILog, 'level' | 'createdAt' | 'moduleName' | 'moduleType'>,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		Logger.fromModule(this, level, data, ops);
	}

	/** Лог уровня DEBUG */
	protected debug(
		message: string,
		extra?: Partial<
			Omit<
				ILog,
				'message' | 'level' | 'createdAt' | 'moduleName' | 'moduleType'
			>
		>,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.DEBUG, { message, ...extra }, ops);
	}

	/** Лог уровня INFO (по умолчанию не сохраняется в файл) */
	protected info(
		message: string,
		extra?: Partial<
			Omit<
				ILog,
				'message' | 'level' | 'createdAt' | 'moduleName' | 'moduleType'
			>
		>,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		const save = ops?.log?.save ?? false; // по умолчанию не сохраняем
		this.log(ELogLevel.INFO, { message, ...extra }, { ...ops, log: { save } });
	}

	/** Лог уровня WARN */
	protected warn(
		message: string,
		extra?: Partial<
			Omit<
				ILog,
				'message' | 'level' | 'createdAt' | 'moduleName' | 'moduleType'
			>
		>,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.WARN, { message, ...extra }, ops);
	}

	/** Лог уровня ERROR */
	protected error(
		message: string,
		extra?: Partial<
			Omit<
				ILog,
				'message' | 'level' | 'createdAt' | 'moduleName' | 'moduleType'
			>
		>,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.ERROR, { message, ...extra }, ops);
	}

	/** Лог уровня FATAL */
	protected fatal(
		message: string,
		extra?: Partial<
			Omit<
				ILog,
				'message' | 'level' | 'createdAt' | 'moduleName' | 'moduleType'
			>
		>,
		ops?: { log?: LogOptions; console?: ConsolePrintOptions }
	): void {
		this.log(ELogLevel.FATAL, { message, ...extra }, ops);
	}
}
