/**
 * @file Mongo.Database.ts
 * @module core/database
 *
 * @author Dmytro Shakh
 */

/**
 * ! lib imports
 */
import { MongoClient, Db, Collection, Document, ClientSession } from 'mongodb';

/**
 * ! my imports
 */
import { MONGO_DB_CONFIG } from '@config';
import { BaseDatabase } from '@core/base/Database.module';

/**
 * Параметры конструктора менеджера БД
 */
export type TMongoManagerOptions = ConstructorParameters<typeof MongoClient>[1];

/**
 * Class representing a mongo database module.
 *
 * @extends BaseDatabase
 */
export class MongoDatabase extends BaseDatabase {
	private client: MongoClient;
	private db: Db | null = null;
	private connectingPromise: Promise<void> | null = null;

	private readonly dbName: string;
	private readonly defaultTimeoutMs: number;

	constructor(opts?: TMongoManagerOptions) {
		super(MongoDatabase.name, 'MongoDb', MONGO_DB_CONFIG.URL);

		this.dbName = MONGO_DB_CONFIG.DB_NAME;
		this.defaultTimeoutMs = MONGO_DB_CONFIG.TIMEOUT_MS;

		this.client = new MongoClient(this.url, {
			serverSelectionTimeoutMS: this.defaultTimeoutMs,
			...opts
		});
	}

	/** Подключение к БД (идемпотентно). */
	public async connect(): Promise<Db> {
		if (!this.connectingPromise) {
			this.connectingPromise = this.client
				.connect()
				.then(() => {
					this.info({
						message: `${this.getColorDatabaseName()} connected successfully`,
						details: {
							dbName: this.dbName,
							url: this.url
						}
					});
					this.db ||= this.client.db(this.dbName);
				})
				.catch(error => {
					this.connectingPromise = null;
					this.error({
						message: 'MongoDB connection error',
						details: { error }
					});
					throw error;
				});
		}
		await this.connectingPromise;
		return this.db!;
	}

	/** Закрыть соединение. */
	public async disconnect(): Promise<void> {
		try {
			await this.client.close();
			this.info({
				message: `${this.getColorDatabaseName()} disconnected`
			});
		} catch (error) {
			this.error({
				message: 'MongoDB disconnection error',
				details: { error }
			});
		} finally {
			this.db = null;
		}
	}

	public async requireDb(): Promise<Db> {
		return this.db ?? this.connect();
	}

	public getCollection<TSchema extends Document = Document>(
		name: string
	): Collection<TSchema> {
		if (!this.db) throw new Error('Mongo client is not connected');
		return this.db.collection<TSchema>(name);
	}

	public async health(): Promise<'ok'> {
		const db = await this.requireDb();
		await db.command({ ping: 1 });
		return 'ok';
	}

	/** Создать новую сессию. */
	public startSession(): ClientSession {
		return this.client.startSession();
	}
}
