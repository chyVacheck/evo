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
 * @extends UtilModule
 *
 * @see UtilModule
 */

/**
 * ! lib imports
 */
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { Stats, type Dirent, type ObjectEncodingOptions } from 'node:fs';

/**
 * ! my imports
 */
import { Logger } from '@core/logger';
import { UtilModule } from '@core/base';

/**
 * Утилиты для работы с файловой системой
 */
class FileUtils extends UtilModule {
	public constructor() {
		super(FileUtils.name);
	}

	/**
	 * Создать директорию (sync, для совместимости)
	 *
	 * @return {void}
	 */
	public async createDir(dirPath: string): Promise<void> {
		await fs.mkdir(dirPath, { recursive: true });
	}

	/**
	 * Создать директорию из пути файла (async)
	 * @example
	 * createDirFromPath('/path/path2/image.png') // создаст директории /path/path2
	 *
	 * @return {void}
	 */
	public async createDirFromPath(filePath: string): Promise<void> {
		await this.createDir(path.dirname(filePath));
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
	 * Получить размер файла
	 * @param {string} filePath Путь к файлу.
	 * @returns {Stats} Статистика файла.
	 */
	public async getFileStats(filePath: string): Promise<Stats> {
		return await fs.stat(filePath);
	}

	/**
	 * Получить размер файла
	 * @param {string} filePath Путь к файлу.
	 * @returns {number} Размер файла в байтах или 0, если файл не существует.
	 */
	public async getFileSize(filePath: string): Promise<number> {
		try {
			return (await this.getFileStats(filePath)).size;
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

	/**
	 * @description
	 * Собрать путь к файлу из частей.
	 *
	 * @param paths - Части пути.
	 * @returns Сформированный путь.
	 */
	public buildPath(...paths: string[]): string {
		return path.join(...paths);
	}

	/**
	 * Читает содержимое директории асинхронно.
	 * @param {string} dirPath Путь к директории.
	 * @returns {Promise<Array<string>>} Список файлов в директории.
	 */
	public async readdir(
		dirPath: string,
		options: ObjectEncodingOptions & {
			withFileTypes: true;
			recursive?: boolean | undefined;
		}
	): Promise<Array<Dirent>>;

	// Перегрузка для остальных случаев (withFileTypes: false или undefined)
	public async readdir(
		dirPath: string,
		options?:
			| (ObjectEncodingOptions & {
					withFileTypes?: false | undefined;
					recursive?: boolean | undefined;
			  })
			| BufferEncoding
			| null
	): Promise<Array<string>>;

	// Реализация
	public async readdir(
		dirPath: string,
		options?: any
	): Promise<Array<string> | Array<Dirent>> {
		return await fs.readdir(dirPath, options);
	}

	/**
	 * Перенос файла (async) с fallback на copy+unlink при EXDEV (другой диск).
	 * Перед переносом гарантирует наличие директории назначения.
	 */
	public async moveFile(src: string, dst: string): Promise<void> {
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
	 * Читает содержимое файла асинхронно.
	 * @param {string} filePath Путь к файлу.
	 * @returns {Promise<string>} Содержимое файла в виде строки.
	 */
	public async readFile(filePath: string): Promise<string> {
		try {
			return await fs.readFile(filePath, 'utf8');
		} catch (e: any) {
			if (e?.code === 'ENOENT') {
				return ''; // Возвращаем пустую строку, если файл не найден
			}
			throw e; // Перебрасываем другие ошибки
		}
	}

	/**
	 * Проверяет существование файла асинхронно.
	 * @param {string} filePath Путь к файлу.
	 * @returns {Promise<boolean>} `true`, если файл существует, иначе `false`.
	 */
	public async fileExists(filePath: string): Promise<boolean> {
		try {
			await fs.access(filePath, fs.constants.F_OK);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * @description
	 * Асинхронно читает и парсит JSON-файл.
	 * @param filePath - Путь к JSON-файлу.
	 * @returns {Promise<any>} Promise, который разрешается в распарсенный JSON-объект.
	 * @throws Error Если файл не может быть прочитан или распарсен.
	 */
	public async readJson(filePath: string): Promise<any> {
		try {
			const fileContent = await this.readFile(filePath);
			return JSON.parse(fileContent);
		} catch (error) {
			Logger.error(
				{
					moduleType: this.getModuleType(),
					moduleName: this.getModuleName(),
					message: `Failed to read or parse JSON file: ${filePath}`,
					details: { error: error }
				},
				{ log: { save: false } }
			);
			throw error; // Перебрасываем ошибку, чтобы вызывающий код мог ее обработать
		}
	}

	/**
	 * Удаление файла (sync)
	 */
	public async deleteFile(filePath: string): Promise<void> {
		try {
			await fs.unlink(path.resolve(filePath));
		} catch (e: any) {
			if (e?.code !== 'ENOENT') throw e;
		}
	}

	/**
	 * Удаление файла (async), безопасное: ENOENT игнорируется
	 * @param {string} filePath - Путь к файлу.
	 * @returns {Promise<void>} Promise, который разрешается, когда файл будет удален.
	 * @throws Error Если файл не может быть удален.
	 */
	public async deleteFileAsync(filePath: string): Promise<void> {
		try {
			await fs.unlink(path.resolve(filePath));
		} catch (e: any) {
			if (e?.code !== 'ENOENT') throw e;
		}
	}
}

/**
 * Экземпляр FileUtils, который может быть использован для вызова методов утилит.
 */
const util = new FileUtils();

/**
 * Экспортируем единственный экземпляр FileUtils
 */
export { util as FileUtils };
