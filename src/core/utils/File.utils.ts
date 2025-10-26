/**
 * @file File.utils.ts
 * @module core/utils
 *
 * Утилиты для работы с ФС:
 * - ensureDir / ensureDirFromPath — гарантируют наличие каталога
 * - moveFileAsync — атомарный перенос, с fallback для EXDEV (другой диск)
 * - deleteFileAsync — безопасное удаление (глушит ENOENT)
 * - sync-аналоги сохранены для обратной совместимости
 *
 * @extends BaseUtil
 *
 * @see BaseUtil
 */

/**
 * ! lib imports
 */
import * as fs from 'node:fs/promises';
import * as fssync from 'node:fs';
import path from 'node:path';

/**
 * ! my imports
 */
import { BaseUtil } from '@core/base';

/**
 * Утилиты для работы с файловой системой
 */
class FileUtils extends BaseUtil {
	static instance: FileUtils = new FileUtils();

	private constructor() {
		super(FileUtils.name);
	}

	/**
	 * Получить текущий экземпляр FileUtils.
	 *
	 * Метод позволяет безопасно получить и использовать ранее инициализированный
	 * экземпляр модуля.
	 *
	 * @return {FileUtils}
	 */
	public static getInstance(): FileUtils {
		return FileUtils.instance;
	}

	/**
	 * Создать директорию (sync, для совместимости)
	 *
	 * @return {void}
	 */
	public createDir(dirPath: string): void {
		fssync.mkdirSync(dirPath, { recursive: true });
	}

	/**
	 * Создать директорию из пути файла (sync)
	 * @example
	 * createDirFromPath('/path/path2/image.png') // создаст директории /path/path2
	 *
	 * @return {void}
	 */
	public createDirFromPath(filePath: string): void {
		this.createDir(path.dirname(filePath));
	}

	/**
	 * Гарантировать наличие каталога (async)
	 */
	public async ensureDir(dirPath: string): Promise<void> {
		await fs.mkdir(dirPath, { recursive: true });
	}

	/**
	 * Гарантировать наличие каталога по пути файла (async)
	 */
	public async ensureDirFromPath(filePath: string): Promise<void> {
		await this.ensureDir(path.dirname(filePath));
	}

	/**
	 * Получает размер файла в байтах.
	 * @param {string} filePath Путь к файлу.
	 * @returns {number} Размер файла в байтах или 0, если файл не существует.
	 */
	public getFileSizeSync(filePath: string): number {
		try {
			const stats = fssync.statSync(filePath);
			return stats.size;
		} catch (e: any) {
			if (e?.code === 'ENOENT') return 0;
			throw e;
		}
	}

	/**
	 * Получить размер файла (async) — если хочешь асинхронную версию
	 * @param {string} filePath Путь к файлу.
	 * @returns {number} Размер файла в байтах или 0, если файл не существует.
	 */
	public async getFileSize(filePath: string): Promise<number> {
		try {
			const stats = await fs.stat(filePath);
			return stats.size;
		} catch (e: any) {
			if (e?.code === 'ENOENT') return 0;
			throw e;
		}
	}

	/**
	 * Определяет расширение файла по имени.
	 * @param {string} name файла
	 * @returns {string} расширение файла
	 */
	public getFileExtension(name: string): string {
		return path.extname(name); // Получаем расширение
	}

	/** Перенос файла (sync, как было) */
	public moveFile(src: string, dst: string): void {
		fssync.renameSync(src, dst);
	}

	/**
	 * Перенос файла (async) с fallback на copy+unlink при EXDEV (другой диск).
	 * Перед переносом гарантирует наличие директории назначения.
	 */
	public async moveFileAsync(src: string, dst: string): Promise<void> {
		await this.ensureDirFromPath(dst);
		try {
			await fs.rename(src, dst);
		} catch (e: any) {
			if (e?.code === 'EXDEV') {
				await fs.copyFile(src, dst);
				await fs.unlink(src);
			} else {
				throw e;
			}
		}
	}

	/**
	 * Удаление файла (sync)
	 */
	public deleteFile(filePath: string): void {
		try {
			fssync.unlinkSync(path.resolve(filePath));
		} catch (e: any) {
			if (e?.code !== 'ENOENT') throw e;
		}
	}

	/**
	 * Удаление файла (async), безопасное: ENOENT игнорируется
	 */
	public async deleteFileAsync(filePath: string): Promise<void> {
		try {
			await fs.unlink(path.resolve(filePath));
		} catch (e: any) {
			if (e?.code !== 'ENOENT') throw e;
		}
	}
}

const util = FileUtils.getInstance();

/**
 * Экспортируем единственный экземпляр FileUtils
 */
export { util as FileUtils };
