/**
 * @file File.repository.ts
 * @module modules/file
 *
 * @description
 * Репозиторий для работы с файлами в MongoDB.
 */

/**
 * ! my imports
 */

import { MongoRepository } from '@core/base';
import { MongoDatabase } from '@core/database';
import { InitializationError } from '@core/errors';
import { FileModel } from '@modules/file/File.model';

export class FileRepository extends MongoRepository<FileModel> {
	private static instance: FileRepository;

	public static async init(mongo: MongoDatabase) {
		if (!FileRepository.instance) {
			FileRepository.instance = new FileRepository(mongo);
		}

		await FileRepository.instance.ensureIndexes();
	}

	public static getInstance(): FileRepository {
		if (!FileRepository.instance) {
			throw new InitializationError({
				message: 'FileRepository not initialized',
				origin: FileRepository.name
			});
		}

		return FileRepository.instance;
	}

	protected constructor(mongo: MongoDatabase) {
		super(FileRepository.name, mongo, 'files', 'File');
	}

	/**
	 * Проверяет и создаёт необходимые индексы для коллекции.
	 * Вызывается при инициализации репозитория или при старте приложения.
	 */
	public async ensureIndexes(): Promise<void> {
		this.debug({ message: `Ensuring indexes for ${this.collectionName}...` });
		await this.col().createIndexes([
			// Пагинация по времени (общая)
			{
				key: { 'system.createdAt': -1 },
				name: 'createdAt_desc'
			},
			// Пагинация по времени (общая)
			{
				key: { 'system.deletedAt': 1 },
				name: 'deletedAt_asc'
			}
		]);
		this.info({ message: `Indexes ensured for ${this.collectionName}` });
	}
}
