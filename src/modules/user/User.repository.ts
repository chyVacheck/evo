/**
 * @file User.repository.ts
 * @module modules/user
 */

/**
 * ! my imports
 */

import { MongoRepository } from '@core/base';
import { MongoDatabase } from '@core/database';
import { InitializationError } from '@core/errors';
import { UserModel } from '@modules/user/User.model';

export class UserRepository extends MongoRepository<UserModel> {
	private static instance: UserRepository;

	public static async init(mongo: MongoDatabase) {
		if (!UserRepository.instance) {
			UserRepository.instance = new UserRepository(mongo);
		}

		await UserRepository.instance.ensureIndexes();
	}

	public static getInstance(): UserRepository {
		if (!UserRepository.instance) {
			throw new InitializationError({
				message: 'UserRepository not initialized',
				origin: UserRepository.name
			});
		}

		return UserRepository.instance;
	}

	protected constructor(mongo: MongoDatabase) {
		super(UserRepository.name, mongo, 'users', 'User');
	}

	/**
	 * Проверяет и создаёт необходимые индексы для коллекции.
	 * Вызывается при инициализации репозитория или при старте приложения.
	 */
	public async ensureIndexes(): Promise<void> {
		this.debug({ message: `Ensuring indexes for ${this.collectionName}...` });
		await this.col().createIndexes([
			// Уникальность email
			{
				key: { 'data.email': 1 },
				name: 'uniq_email',
				unique: true
			},

			// Пагинация по времени (общая)
			{
				key: { 'system.createdAt': -1 },
				name: 'createdAt_desc'
			}
		]);
		this.info({ message: `Indexes ensured for ${this.collectionName}` });
	}
}
