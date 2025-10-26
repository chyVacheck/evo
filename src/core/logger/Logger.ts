/**
 * @file Logger.ts
 * @module core/logger
 *
 * @description
 * Универсальный и расширяемый логгер:
 * - Логирование по уровням (DEBUG, INFO, WARN, ERROR, FATAL)
 * - Цветной вывод в консоль
 * - Сохранение логов в файл
 * - Компрессия логов
 * - Привязка к модулю и requestId
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import {
	ELogLevel,
	ILog,
	ILogStored,
	EModuleType,
	StrictDateString,
	LogOptions,
	ConsolePrintOptions
} from '@core/types';
import { LogReader } from './LogReader';
import { FileWriter } from './FileWriter';
import { LogCompressor } from './LogCompressor';
import { ConsoleWriter } from './ConsoleWriter';
import { LOGGER_CONFIG } from '@config';

type LogOps = { log?: LogOptions; console?: ConsolePrintOptions };

/**
 * @class Logger
 * Центральный статический логгер для всей системы.
 */
export class Logger {
	private static readonly consoleWriter = ConsoleWriter.getInstance();
	private static readonly fileWriter = FileWriter.getInstance();
	private static readonly reader = LogReader.getInstance();
	private static readonly compressor = LogCompressor.getInstance();

	/**
	 * ? === === === FILE METHODS === === ===
	 */

	/**
	 * Получает все логи за указанную дату.
	 *
	 * @param {StrictDateString} date Строка даты в формате YYYY-MM-DD
	 * @returns Массив сжатых логов
	 */
	public static getLogsByDate(date: StrictDateString): Array<ILogStored> {
		return this.reader.getLogsByDate(date);
	}

	/**
	 * ? === === === CORE METHODS === === ===
	 */

	/** Общая точка входа для записи лога. */
	private static log(logData: Omit<ILog, 'createdAt'>, ops?: LogOps): void {
		const log: ILog = {
			createdAt: new Date(),
			...logData
		};

		// консоль — всегда печатаем
		this.consoleWriter.print(log, ops?.console);

		// сохранять ли в файл: явная опция имеет приоритет, иначе берём из конфига
		const shouldSave = ops?.log?.save ?? LOGGER_CONFIG.FILE.ENABLE === true;

		// если не нужно сохранить лог — заканчиваем
		if (!shouldSave) return;

		// получаем опцию проверки пути к файлу
		const shouldCheckPath =
			ops?.log?.checkPath ?? LOGGER_CONFIG.FILE.CHECK_PATH === true;

		// проверка пути к файлу перед сохранением
		if (shouldCheckPath) {
			this.fileWriter.ensureDirectoryStructure();
		}

		this.saveLog(log, ops);
	}

	/** Сохраняет лог в файл (с компрессией). */
	private static saveLog(log: ILog, ops?: LogOps): void {
		try {
			const stored = this.compressor.compress(log);
			this.fileWriter.append(stored);
		} catch (err: unknown) {
			// если упали при сохранении — пишем об этом в консоль как system-error
			this.consoleWriter.print(
				{
					...log,
					level: ELogLevel.ERROR,
					message: 'Error saving log',
					moduleType: EModuleType.SYSTEM,
					moduleName: Logger.name,
					details: { saveError: err }
				},
				ops?.console
			);
		}
	}

	/**
	 * ? === === === PUBLIC API === === ===
	 */

	/**
	 * Лог уровня DEBUG. Используется для детальных сообщений, которые могут помочь в отладке.
	 *
	 * @param data Данные лога, исключая уровень и дату создания.
	 * @param ops Опции логирования, включая настройки вывода в консоль и сохранения в файл.
	 */
	public static debug(
		data: Omit<ILog, 'level' | 'createdAt'>,
		ops?: LogOps
	): void {
		this.log({ ...data, level: ELogLevel.DEBUG }, ops);
	}

	/**
	 *
	 * Лог уровня INFO. Используется для информационных сообщений, которые не являются ошибками,
	 * но могут потребовать внимания разработчика.
	 *
	 * @param data Данные лога, исключая уровень и дату создания.
	 * @param ops Опции логирования, включая настройки вывода в консоль и сохранения в файл.
	 */
	public static info(
		data: Omit<ILog, 'level' | 'createdAt'>,
		ops?: LogOps
	): void {
		this.log({ ...data, level: ELogLevel.INFO }, ops);
	}

	/**
	 * Лог уровня WARN. Используется для предупреждений, которые не являются ошибками,
	 * но могут потребовать внимания разработчика.
	 *
	 * @param data Данные лога, исключая уровень и дату создания.
	 * @param ops Опции логирования, включая настройки вывода в консоль и сохранения в файл.
	 */
	public static warn(
		data: Omit<ILog, 'level' | 'createdAt'>,
		ops?: LogOps
	): void {
		this.log({ ...data, level: ELogLevel.WARN }, ops);
	}

	/**
	 * Лог уровня ERROR. Используется для ошибок, которые не приводят к завершению работы программы,
	 * но могут повлиять на её работу.
	 *
	 * @param data Данные лога, исключая уровень и дату создания.
	 * @param ops Опции логирования, включая настройки вывода в консоль и сохранения в файл.
	 */
	public static error(
		data: Omit<ILog, 'level' | 'createdAt'>,
		ops?: LogOps
	): void {
		this.log({ ...data, level: ELogLevel.ERROR }, ops);
	}

	/**
	 * Лог уровня FATAL. Используется для критических ошибок, которые приводят к завершению работы программы.
	 *
	 * @param data Данные лога, исключая уровень и дату создания.
	 * @param ops Опции логирования, включая настройки вывода в консоль и сохранения в файл.
	 */
	public static fatal(
		data: Omit<ILog, 'level' | 'createdAt'>,
		ops?: LogOps
	): void {
		this.log({ ...data, level: ELogLevel.FATAL }, ops);
	}

	/**
	 * Удобный helper: логирование «из модуля» (объект должен иметь геттеры имени и типа).
	 * Полезно для наследников CoreModule.
	 */
	public static fromModule(
		moduleLike: { getModuleName(): string; getModuleType(): EModuleType },
		level: ELogLevel,
		data: Omit<ILog, 'level' | 'createdAt' | 'moduleName' | 'moduleType'>,
		ops?: LogOps
	): void {
		this.log(
			{
				...data,
				level,
				moduleName: moduleLike.getModuleName(),
				moduleType: moduleLike.getModuleType()
			},
			ops
		);
	}
}
