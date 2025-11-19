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
 *             ├── 001.json
 *             └── 002.json
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
import { LOGGER_CONFIG } from '@config';
import { CoreModule } from '@core/base';
import { FileUtils } from '@core/utils';
import {
	EModuleType,
	type ILogStored,
	type StrictDateString
} from '@core/types';

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
	private async getLogFilesForDate(
		date: StrictDateString
	): Promise<Array<string>> {
		const basePath = FileUtils.buildPath(LOGGER_CONFIG.FILE.PATH, date);
		const files: string[] = [];

		if (!(await FileUtils.fileExists(basePath))) return [];

		const hours = fs
			.readdirSync(basePath)
			.filter(name =>
				fs.statSync(FileUtils.buildPath(basePath, name)).isDirectory()
			);

		for (const hour of hours) {
			const hourPath = FileUtils.buildPath(basePath, hour);
			const jsonFiles = fs
				.readdirSync(hourPath)
				.filter(file => file.endsWith('.json'))
				.map(file => FileUtils.buildPath(hourPath, file));

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
	public async getLogsByDate(
		date: StrictDateString
	): Promise<Array<ILogStored>> {
		const files = await this.getLogFilesForDate(date);
		return this.readLogsFromFiles(files);
	}
}
