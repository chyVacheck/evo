/**
 * @file LogReader.ts
 * @module core/logger
 *
 * @description
 * Класс для чтения логов из файловой системы.
 * Поддерживает чтение NDJSON-файлов, разбитых по датам.
 *
 * @example
 * Пример структуры файлов:
 * └── logs/
 *     └── 2025-07-26/
 *         └── 01/
 *             ├── 01.json
 *             └── 02.json
 *
 */

/**
 * ! lib imports
 */
import fs from 'fs';
import path from 'path';

/**
 * ! my imports
 */
import { CoreModule } from '@core/base';
import { EModuleType, ILogStored, StrictDateString } from '@core/types';
import { LOGGER_CONFIG } from '@config';

/**
 * Утилита для чтения лог-файлов
 */
export class LogReader extends CoreModule {
	private static INSTANCE: LogReader;

	/**
	 * Получить текущий экземпляр LogReader.
	 *
	 * Метод позволяет безопасно получить и использовать ранее инициализированный
	 * экземпляр модуля.
	 *
	 * @return {LogReader}
	 */
	public static getInstance(): LogReader {
		if (!this.INSTANCE) this.INSTANCE = new LogReader();
		return LogReader.INSTANCE;
	}

	private constructor() {
		super(EModuleType.SYSTEM, LogReader.name);
	}

	/**
	 * Получает список путей ко всем лог-файлам за указанную дату.
	 *
	 * @param {StrictDateString} date Строка даты в формате YYYY-MM-DD
	 * @returns Список путей или пустой массив, если файлов нет
	 */
	private getLogFilesForDate(date: StrictDateString): Array<string> {
		const basePath = path.join(LOGGER_CONFIG.FILE.PATH, date);
		const files: string[] = [];

		if (!fs.existsSync(basePath)) return [];

		const hours = fs
			.readdirSync(basePath)
			.filter(name => fs.statSync(path.join(basePath, name)).isDirectory());

		for (const hour of hours) {
			const hourPath = path.join(basePath, hour);
			const jsonFiles = fs
				.readdirSync(hourPath)
				.filter(file => file.endsWith('.json'))
				.map(file => path.join(hourPath, file));

			files.push(...jsonFiles);
		}

		return files;
	}

	/**
	 * Читает логи из переданных NDJSON-файлов.
	 *
	 * @param filePaths Массив путей к .json-файлам
	 * @returns Массив сжатых логов
	 */
	private readLogsFromFiles(filePaths: string[]): Array<ILogStored> {
		const allLogs: Array<ILogStored> = [];

		for (const filePath of filePaths) {
			try {
				const content = fs.readFileSync(filePath, 'utf-8');
				const lines = content.split('\n').filter(Boolean);

				for (const line of lines) {
					try {
						const parsed = JSON.parse(line);
						allLogs.push(parsed);
					} catch {
						console.warn(
							`[LogReader] Parsing error of string in ${filePath}:`,
							line
						);
					}
				}
			} catch (err) {
				console.error(`[LogReader] Error of reading file ${filePath}:`, err);
			}
		}

		return allLogs;
	}

	/**
	 * Получает все логи за указанную дату.
	 *
	 * @param {StrictDateString} date Строка даты в формате YYYY-MM-DD
	 * @returns Массив сжатых логов
	 */
	public getLogsByDate(date: StrictDateString): Array<ILogStored> {
		const files = this.getLogFilesForDate(date);
		return this.readLogsFromFiles(files);
	}
}
