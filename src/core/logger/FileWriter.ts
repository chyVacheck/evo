/**
 * @file FileWriter.ts
 * @module core/logger
 *
 * @description
 * Отвечает за файловое сохранение логов по схеме:
 * logs/YYYY-MM-DD/HH/NN.json
 * где:
 * - YYYY-MM-DD — дата
 * - HH — час в 24-часовом формате
 * - NN — номер файла за этот час
 *
 * Автоматически создаёт директории и переключается на новый файл,
 * если текущий превышает допустимый размер.
 *
 * @author Dmytro Shakh
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
import { EModuleType, ILogStored } from '@core/types';
import { DateUtils, FileUtils } from '@core/utils';

/**
 * Состояние текущего лог-файла
 */
interface ILogFileState {
	currentDate: string;
	currentHour: string;
	currentFileIndex: number;
	currentFileSize: number;
}

/**
 * Класс FileWriter отвечает за построчную запись логов в файлы с ограничением по размеру.
 */
export class FileWriter extends CoreModule {
	private static INSTANCE: FileWriter;

	private readonly maxFileSize = LOGGER_CONFIG.FILE.MAX_LOG_SIZE;
	private readonly baseDir = path.resolve(LOGGER_CONFIG.FILE.PATH);
	private state: ILogFileState;

	private stream: fs.WriteStream | null = null;
	private queue: string[] = [];
	private flushing = false;

	/**
	 * Получить текущий экземпляр FileWriter.
	 *
	 * Метод позволяет безопасно получить и использовать ранее инициализированный
	 * экземпляр модуля.
	 *
	 * @return {FileWriter}
	 */
	public static getInstance(): FileWriter {
		if (!this.INSTANCE) this.INSTANCE = new FileWriter();
		return FileWriter.INSTANCE;
	}

	private constructor() {
		super(EModuleType.SYSTEM, FileWriter.name);
		const now = new Date();
		this.state = {
			currentDate: DateUtils.getCurrentStrictDateString(),
			currentHour: String(now.getHours()).padStart(2, '0'),
			currentFileIndex: 1,
			currentFileSize: 0
		};
		this.state.currentFileSize = this.getCurrentSize(
			this.getCurrentLogFilePath()
		);
		this.ensureDirectoryStructure();
	}

	private getCurrentSize(filePath: string) {
		try {
			return fs.statSync(filePath).size;
		} catch {
			return 0;
		}
	}

	/**
	 * Открывает поток записи в указанный файл.
	 * @param filePath Путь к лог-файлу
	 */
	private openStream(filePath: string) {
		if (this.stream) this.stream.end();
		this.stream = fs.createWriteStream(filePath, { flags: 'a' });
	}

	/**
	 * Асинхронно записывает данные из очереди в файл.
	 * @returns Промис, который разрешается, когда запись завершена
	 */
	private flushAsync() {
		if (this.flushing || this.queue.length === 0 || !this.stream) return;
		this.flushing = true;
		const chunk = this.queue.join('');
		this.queue.length = 0;

		this.stream.write(chunk, () => {
			this.state.currentFileSize += Buffer.byteLength(chunk);
			this.flushing = false;
			if (this.queue.length) this.flushAsync();
		});
	}

	/**
	 * Добавляет лог в текущий файл. Переключается на новый, если превышен лимит.
	 * @param log Сжатый лог
	 */
	public append(log: ILogStored): void {
		this.updateStateIfNeeded();
		this.ensureDirectoryStructure();
		const line = JSON.stringify(log) + '\n';
		const lineSize = Buffer.byteLength(line);

		// Если превысим лимит — переключаемся на новый файл
		if (this.state.currentFileSize + lineSize > this.maxFileSize) {
			this.state.currentFileIndex += 1;
			this.state.currentFileSize = 0;
			this.openStream(this.getCurrentLogFilePath());
		}

		if (!this.stream) this.openStream(this.getCurrentLogFilePath());

		this.queue.push(line);
		this.flushAsync();
	}

	/**
	 * Возвращает путь к текущему лог-файлу
	 * @returns Полный путь до log-файла
	 */
	public getCurrentLogFilePath(): string {
		const { currentDate, currentHour, currentFileIndex } = this.state;
		const hourDir = path.join(this.baseDir, currentDate, currentHour);
		const fileName = String(currentFileIndex).padStart(3, '0') + '.json';
		return path.join(hourDir, fileName);
	}

	/**
	 * Убеждаемся, что директории YYYY-MM-DD/HH существуют
	 */
	public ensureDirectoryStructure(): void {
		const { currentDate, currentHour } = this.state;
		const dirPath = path.join(this.baseDir, currentDate, currentHour);

		FileUtils.createDir(dirPath);
	}

	/**
	 * Обновляет дату и час, сбрасывая счётчики при необходимости
	 */
	private updateStateIfNeeded(): void {
		const now = new Date();
		const newDate = DateUtils.toStrictDateString(now);
		const newHour = String(now.getHours()).padStart(2, '0');

		const dateChanged = this.state.currentDate !== newDate;
		const hourChanged = this.state.currentHour !== newHour;

		if (dateChanged || hourChanged) {
			this.state = {
				currentDate: newDate,
				currentHour: newHour,
				currentFileIndex: 1,
				currentFileSize: 0
			};
		}
	}
}
