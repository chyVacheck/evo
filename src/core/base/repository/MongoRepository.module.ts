/**
 * @file MongoRepository.ts
 * @module core/base/repository
 *
 * @description
 * Абстрактный базовый репозиторий для MongoDB поверх нативного драйвера `mongodb`.
 * Реализует унифицированный контракт CRUD.
 *
 * @example
 * ```ts
 * class UserRepository extends MongoRepository<IUser> {
 * 	 constructor() {
 * 		super(UserRepository.name, mongo, "users");
 * 	 }
 * }
 * ```
 */

/**
 * ! lib imports
 */
import {
	Collection,
	Document,
	Filter as FilterMongo,
	WithId,
	InsertOneResult as InsertOneResultMongo,
	InsertManyResult as InsertManyResultMongo,
	FindOptions as FindOptionsMongo,
	CountOptions as CountOptionsMongo,
	UpdateFilter as UpdateFilterMongo,
	UpdateOptions as UpdateOptionsMongo,
	UpdateResult as UpdateResultMongo,
	FindOneAndUpdateOptions as ModifyOptionsMongo,
	ModifyResult as ModifyResultMongo,
	DeleteOptions as DeleteOptionsMongo,
	DeleteResult as DeleteResultMongo,
	OptionalUnlessRequiredId as OptionalUnlessRequiredIdMongo,
	OptionalUnlessRequiredId
} from 'mongodb';

/**
 * ! my imports
 */
import {
	FindOneOptions,
	FindManyOptions,
	CountOptions,
	ExistsOptions,
	UpdateOneOptions,
	UpdateManyOptions,
	ModifyOneOptions,
	DeleteOneOptions,
	DeleteManyOptions,
	InsertOneOptions,
	InsertManyOptions
} from '@core/types';
import { RepositoryModule } from '@core/base/repository/Repository.module';
import { MongoDatabase } from '@core/database';

/**
 * Базовый репозиторий для MongoDB.
 *
 * @typeParam TModel — Тип документа коллекции (расширяет `Document`).
 * @typeParam TUpdate — Тип апдейта (обычно `UpdateFilter<TModel> | Partial<TModel>`).
 *
 * @description
 * Базовый репозиторий для MongoDB.
 * Реализует унифицированный контракт CRUD/пагинации/агрегаций/транзакций
 */
export abstract class MongoRepository<
	TModel extends Document = Document
> extends RepositoryModule {
	/** Менеджер подключения к MongoDB. */
	protected readonly mongo: MongoDatabase;
	/** Имя коллекции. */
	protected readonly collectionName: string;
	/** Имя сущности. */
	protected readonly entityName: string;

	/**
	 * Конструктор базового репозитория для MongoDB.
	 * @param {string} moduleName Имя модуля репозитория.
	 * @param {MongoDatabase} mongo Менеджер подключения к MongoDB.
	 * @param {string} collectionName Имя коллекции.
	 */
	constructor(
		moduleName: string,
		mongo: MongoDatabase,
		collectionName: string,
		entityName: string
	) {
		super(moduleName);
		/** Менеджер подключения к MongoDB. */
		this.mongo = mongo;
		/** Имя коллекции. */
		this.collectionName = collectionName;
		/** Имя сущности. */
		this.entityName = entityName;
	}

	/**
	 * * === === === Indexes === === ===
	 */

	/**
	 * @description
	 * Создать индексы коллекции.
	 */
	abstract ensureIndexes(): Promise<void>;

	/**
	 * * === === === Build Options === === ===
	 */

	/**
	 * Построить опции поиска с учётом всех ключевых опций.
	 * - projection: Direction, поддерживает "nested.path"
	 * - sort: Direction, поддерживает "nested.path"
	 * - прочие опции: maxTimeMS, hint, readPreference, session, comment
	 */
	protected buildFindOptions(
		o?: FindOneOptions<TModel>,
		extra?: Pick<FindOptionsMongo<TModel>, 'limit' | 'skip'>
	): FindOptionsMongo<TModel> {
		return {
			sort: o?.sort ?? { _id: 1 },
			...(o?.projection && { projection: o.projection }),
			...(o?.maxTimeMS !== undefined && { maxTimeMS: o.maxTimeMS }),
			...(o?.hint && { hint: o.hint }),
			...(o?.readPreference && { readPreference: o.readPreference }),
			...(o?.session && { session: o.session }),
			...(o?.comment && { comment: o.comment }),
			...(extra?.limit !== undefined && { limit: extra.limit }),
			...(extra?.skip !== undefined && { skip: extra.skip })
		};
	}

	/**
	 * Построить опции подсчет с учётом всех ключевых опций.
	 * - опции: maxTimeMS, hint, readPreference, session, comment
	 */
	protected buildCountOptions(o?: CountOptions<TModel>): CountOptionsMongo {
		return {
			...(o?.maxTimeMS !== undefined && { maxTimeMS: o.maxTimeMS }),
			...(o?.hint && { hint: o.hint }),
			...(o?.readPreference && { readPreference: o.readPreference }),
			...(o?.session && { session: o.session }),
			...(o?.comment && { comment: o.comment })
		};
	}

	/**
	 * Построить опции обновления с учётом всех ключевых опций.
	 * - upsert: boolean
	 * - arrayFilters: ReadonlyArray<Record<string, unknown>>
	 * - hint: HintSpec<TModel>
	 * - maxTimeMS: number
	 * - session: ClientSession
	 * - comment: string
	 */
	protected buildUpdateOptions(
		o?: UpdateOneOptions<TModel>
	): UpdateOptionsMongo {
		return {
			...(o?.upsert !== undefined && { upsert: o.upsert }),
			...(o?.arrayFilters && { arrayFilters: o.arrayFilters }),
			...(o?.hint && { hint: o.hint }),
			...(o?.maxTimeMS !== undefined && { maxTimeMS: o.maxTimeMS }),
			...(o?.session && { session: o.session }),
			...(o?.comment && { comment: o.comment }),
			...(o?.bypassDocumentValidation !== undefined && {
				bypassDocumentValidation: o.bypassDocumentValidation
			}),
			...(o?.let && { let: o.let })
		};
	}

	/**
	 * Построить опции поиска с учётом всех ключевых опций.
	 * - projection: Direction, поддерживает "nested.path"
	 * - sort: Direction, поддерживает "nested.path"
	 * - прочие опции: maxTimeMS, hint, readPreference, session, comment
	 */
	protected buildModifyOptions(
		o?: ModifyOneOptions<TModel>
	): ModifyOptionsMongo {
		let returnDocument: 'after' | 'before' = 'after';
		if (o?.returnUpdated !== undefined) {
			returnDocument = o.returnUpdated ? 'after' : 'before';
		}

		return {
			...(o?.projection && { projection: o.projection }),
			...(o?.upsert !== undefined && { upsert: o.upsert }),
			...(o?.arrayFilters && { arrayFilters: o.arrayFilters }),
			...(o?.hint && { hint: o.hint }),
			...(o?.maxTimeMS !== undefined && { maxTimeMS: o.maxTimeMS }),
			...(o?.readPreference && { readPreference: o.readPreference }),
			...(o?.session && { session: o.session }),
			...(o?.comment && { comment: o.comment }),
			...(o?.sort ? { sort: o.sort } : { sort: { _id: 1 } }),
			...(o?.bypassDocumentValidation !== undefined && {
				bypassDocumentValidation: o.bypassDocumentValidation
			}),
			...(o?.let && { let: o.let }),
			returnDocument
		};
	}

	/**
	 * Построить опции удаления с учётом всех ключевых опций.
	 * - maxTimeMS: number
	 * - hint: HintSpec<TModel>
	 * - session: ClientSession
	 * - comment: string
	 */
	protected buildDeleteOptions(
		o?: DeleteOneOptions<TModel>
	): DeleteOptionsMongo {
		return {
			...(o?.maxTimeMS !== undefined && { maxTimeMS: o.maxTimeMS }),
			...(o?.hint && { hint: o.hint }),
			...(o?.session && { session: o.session }),
			...(o?.comment && { comment: o.comment }),
			...(o?.collation && { collation: o.collation })
		};
	}

	/**
	 * * === === === Other === === ===
	 */

	/**
	 * @todo убрать `as FilterMongo<TModel>` когда будет встроенная поддержка.
	 * Создание объединенного фильтра с помощью оператора $and.
	 */
	protected mergeAnd(
		...parts: ReadonlyArray<FilterMongo<TModel>>
	): FilterMongo<TModel> {
		/**
		 * Проверяем на пустой массив parts.
		 */
		if (parts.length === 0) {
			throw new Error('mergeAnd: parts must not be empty');
		}

		// если один фильтр — верни его без обёртки (TS любит это)
		if (parts.length === 1) return parts[0]!;

		return {
			$and: parts
		} as FilterMongo<TModel>;
	}

	/**
	 * Получить коллекцию.
	 */
	protected col(): Collection<TModel> {
		return this.mongo.getCollection<TModel>(this.collectionName);
	}

	/**
	 * ? === === === Public === === ===
	 */

	/**
	 * Получить имя коллекции.
	 */
	public getCollectionName(): string {
		return this.collectionName;
	}

	/**
	 * Получить имя сущности.
	 */
	public getEntityName(): string {
		return this.entityName;
	}

	/**
	 * ! === === === CRUD === === ===
	 */

	/**
	 * ? === === === CREATE === === ===
	 */

	/**
	 * Вставка документа.
	 * @param {OptionalUnlessRequiredId<TModel>} doc документ для вставки
	 * @param {InsertOneOptions<TModel>} options опции вставки (session, comment, bypassDocumentValidation и т.д.)
	 * @returns {Promise<WithId<TModel>>} вставленный документ (полностью, повторно прочитанный из БД)
	 */
	public async insertOne(
		doc: OptionalUnlessRequiredId<TModel>,
		options?: InsertOneOptions<TModel>
	): Promise<InsertOneResultMongo<TModel>> {
		return await this.col().insertOne(doc, options);
	}

	/**
	 * Вставка нескольких документов.
	 * @param {ReadonlyArray<OptionalUnlessRequiredId<TModel>>} docs документы для вставки
	 * @param {InsertManyOptions<TModel>} options опции вставки (session, comment, bypassDocumentValidation и т.д.)
	 * @returns {Promise<InsertManyResultMongo<TModel>>} вставленные документы (полностью, повторно прочитанные из БД)
	 */
	public async insertMany(
		docs: ReadonlyArray<OptionalUnlessRequiredIdMongo<TModel>>,
		options?: InsertManyOptions<TModel>
	): Promise<InsertManyResultMongo<TModel>> {
		if (docs.length === 0) {
			return { acknowledged: true, insertedCount: 0, insertedIds: {} };
		}

		return await this.col().insertMany(docs, options);
	}

	/**
	 * ? === === === READ === === ===
	 */

	/**
	 * Поиск одного документа по id с поддержкой всех ключевых опций.
	 * @param {TModel['_id']} id id сущности
	 * @param {FindOneOptions<TModel>} options опции поиска
	 * @returns {WithId<TModel> | null} найденный документ или null
	 */
	public async findOneById(
		id: TModel['_id'],
		options?: FindOneOptions<TModel>
	): Promise<WithId<TModel> | null> {
		/** Фильтр для поиска по идентификатору. */
		const filter: FilterMongo<TModel> = { _id: id };
		/** Выполняем поиск с учётом фильтра и опций. */
		return this.findOneByFilter(filter, options);
	}

	/**
	 * Поиск одного документа по типизированному фильтру с поддержкой всех ключевых опций.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {FindManyOptions<TModel>}options опции поиска
	 * @returns {WithId<TModel> | null} найденный документ или null
	 */
	public async findOneByFilter(
		filter: FilterMongo<TModel>,
		options?: FindOneOptions<TModel>
	): Promise<WithId<TModel> | null> {
		/** Строим опции поиска с учётом всех ключевых опций. */
		const findOptions = this.buildFindOptions(options);
		/** Выполняем поиск с учётом фильтра и опций. */
		return this.col().findOne(filter, findOptions);
	}

	/**
	 * Поиск одного документа по id с поддержкой всех ключевых опций.
	 * @param {Array<TModel['_id']>} ids массив id сущностей
	 * @param {FindManyOptions<TModel>}options опции поиска
	 * @returns {Promise<Array<WithId<TModel>>>} список документов или пустой массив
	 */
	public async findManyByIds(
		ids: Array<TModel['_id']>,
		options: FindManyOptions<TModel>
	): Promise<Array<WithId<TModel>>> {
		/** Фильтр для поиска по идентификаторам. */
		const filter: FilterMongo<TModel> = {
			_id: { $in: ids }
		};
		/** Выполняем поиск с учётом фильтра и опций. */
		return await this.findManyByFilter(filter, options);
	}

	/**
	 * Поиск множества документов по типизированному фильтру с offset-пагинацией.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {FindManyOptions<TModel>} options опции поиска
	 * @returns {Promise<Array<WithId<TModel>>>} список документов или пустой массив
	 
	 */
	public async findManyByFilter(
		filter: FilterMongo<TModel>,
		options: FindManyOptions<TModel>
	): Promise<Array<WithId<TModel>>> {
		/** Строим опции поиска с учётом всех ключевых опций. */
		const findOptions = this.buildFindOptions(options, {
			skip: options.skip,
			limit: options.limit
		});
		/** Выполняем поиск с учётом фильтра и опций. */
		return await this.col().find(filter, findOptions).toArray();
	}

	/**
	 * * === === === Exists === === ===
	 */

	/**
	 * Проверка существования документа по фильтру.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {ExistsOptions<TModel>} options опции поиска
	 * @returns {boolean} true, если документ существует, иначе false
	 */
	public async existsByFilter(
		filter: FilterMongo<TModel>,
		options?: ExistsOptions<TModel>
	): Promise<boolean> {
		/** Строим опции поиска с учётом всех ключевых опций. */
		const findOptions = this.buildFindOptions(options, {
			limit: 1
		});
		const doc = await this.col().findOne(filter, findOptions);
		return doc !== null;
	}

	/**
	 * * === === === Count === === ===
	 */

	/**
	 * Подсчёт количества документов, удовлетворяющих фильтру.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {CountOptions<TModel>} options опции подсчёта
	 * @returns {number} количество документов
	 */
	public async countByFilter(
		filter: FilterMongo<TModel>,
		options?: CountOptions<TModel>
	): Promise<number> {
		/** Строим опции поиска с учётом всех ключевых опций. */
		const countOptions = this.buildCountOptions(options);
		/** Выполняем подсчёт с учётом фильтра и опций. */
		return await this.col().countDocuments(filter, countOptions);
	}

	/**
	 * ? === === === UPDATE === === ===
	 */

	/**
	 * * === === === Update === === ===
	 */

	/**
	 * Обновление одного документа по его идентификатору.
	 * @param {TModel['_id']} id идентификатор документа
	 * @param {UpdateFilter<TModel> | Partial<TModel>} update данные для обновления
	 * @param {UpdateOneOptions<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateOneById(
		id: TModel['_id'],
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: UpdateOneOptions<TModel>
	): Promise<UpdateResultMongo<TModel>> {
		/** Создание фильтра по идентификатору. */
		const filter: FilterMongo<TModel> = { _id: id };
		/** Вызов метода обновления по фильтру. */
		return this.updateOneByFilter(filter, update, options);
	}

	/**
	 * Обновление одного документа по фильтру.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {UpdateFilter<TModel> | Partial<TModel>} update данные для обновления
	 * @param {UpdateOneOptions<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateOneByFilter(
		filter: FilterMongo<TModel>,
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: UpdateOneOptions<TModel>
	): Promise<UpdateResultMongo<TModel>> {
		/** Создание опций обновления. */
		const updateOptions = this.buildUpdateOptions(options);
		/** Вызов метода обновления по фильтру. */
		return this.col().updateOne(filter, update, updateOptions);
	}

	/**
	 * Обновление многих документов по их идентификатору.
	 * @param {Array<TModel['_id']>} ids идентификаторы документов
	 * @param {UpdateFilter<TModel> | Partial<TModel>} update данные для обновления
	 * @param {UpdateManyOptions<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateManyByIds(
		ids: Array<TModel['_id']>,
		update: UpdateFilterMongo<TModel> | Array<Document>,
		options?: UpdateManyOptions<TModel>
	): Promise<UpdateResultMongo<TModel>> {
		/** Создание фильтра по идентификатору. */
		const filter: FilterMongo<TModel> = { _id: { $in: ids } };
		/** Вызов метода обновления по фильтру. */
		return this.updateManyByFilter(filter, update, options);
	}

	/**
	 * Обновление многих документов по фильтру.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {UpdateFilter<TModel> | Partial<TModel>} update данные для обновления
	 * @param {UpdateManyOptions<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateManyByFilter(
		filter: FilterMongo<TModel>,
		update: UpdateFilterMongo<TModel> | Array<Document>,
		options?: UpdateManyOptions<TModel>
	): Promise<UpdateResultMongo<TModel>> {
		/** Создание опций обновления. */
		const updateOptions = this.buildUpdateOptions(options);
		/** Вызов метода обновления по фильтру. */
		return this.col().updateMany(filter, update, updateOptions);
	}

	/**
	 * * === === === Modify === === ===
	 */

	/**
	 * Обновление одного документа по его идентификатору с возвратом обновлённого документа.
	 * @param {TModel['_id']} id идентификатор документа
	 * @param {UpdateFilter<TModel> | Partial<TModel>} update данные для обновления
	 * @param {ModifyOneOptions<TModel>} options опции обновления
	 * @returns {Promise<ModifyResult<TModel>>} данные о результате обновления
	 */
	public async modifyOneById(
		id: TModel['_id'],
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: ModifyOneOptions<TModel>
	): Promise<ModifyResultMongo<TModel>> {
		/** Применение видимости к фильтру, учитывая опции удаления. */
		const filter: FilterMongo<TModel> = { _id: id };
		/** Вызов метода обновления по фильтру. */
		return this.modifyOneByFilter(filter, update, options);
	}

	/**
	 * Обновление одного документа по фильтру с возвратом данных о обновлении документа.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {UpdateFilter<TModel> | Partial<TModel>} update данные для обновления
	 * @param {ModifyOneOptions<TModel>} options опции обновления
	 * @returns {Promise<ModifyResult<TModel>>} данные о результате обновления
	 */
	public async modifyOneByFilter(
		filter: FilterMongo<TModel>,
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: ModifyOneOptions<TModel>
	): Promise<ModifyResultMongo<TModel>> {
		/** Создание опций обновления. */
		const modifyOptions = this.buildModifyOptions(options);
		/** Вызов метода обновления по фильтру. */
		return await this.col().findOneAndUpdate(filter, update, {
			...modifyOptions,
			includeResultMetadata: true
		});
	}

	/**
	 * ? === === === DELETE === === ===
	 */

	/**
	 * Удаление одного документа по его идентификатору.
	 * @param {TModel['_id']} id идентификатор документа
	 * @param {DeleteOneOptions<TModel>} options опции удаления
	 * @returns {Promise<DeleteResult>} данные о результате удаления
	 */
	public async deleteOneById(
		id: TModel['_id'],
		options?: DeleteOneOptions<TModel>
	): Promise<DeleteResultMongo> {
		/** Создание фильтра по идентификатору. */
		const filter: FilterMongo<TModel> = { _id: id };
		/** Вызов метода удаления по фильтру. */
		return this.deleteOneByFilter(filter, options);
	}

	/**
	 * Удаление одного документа по фильтру.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {DeleteOneOptions<TModel>} options опции удаления
	 * @returns {Promise<DeleteResult>} данные о результате удаления
	 */
	public async deleteOneByFilter(
		filter: FilterMongo<TModel>,
		options?: DeleteOneOptions<TModel>
	): Promise<DeleteResultMongo> {
		/** Фильтр для поиска. */
		const deleteOptions = this.buildDeleteOptions(options);
		/** Выполняем операцию с учётом фильтра и опций. */
		return this.col().deleteOne(filter, deleteOptions);
	}

	/**
	 * Удаление многих документов по фильтру.
	 * @param {Array<TModel['_id']>} ids массив идентификаторов документов
	 * @param {DeleteManyOptions<TModel>} options опции удаления
	 * @returns {Promise<DeleteResult>} данные о результате удаления
	 */
	public async deleteManyByIds(
		ids: Array<TModel['_id']>,
		options?: DeleteManyOptions<TModel>
	): Promise<DeleteResultMongo> {
		/** Проверка на пустой массив идентификаторов. */
		if (ids.length === 0) {
			return { acknowledged: true, deletedCount: 0 };
		}
		/** Фильтр для поиска документов по их идентификаторам. */
		const filter: FilterMongo<TModel> = { _id: { $in: ids } };
		/** Выполняем операцию с учётом фильтра и опций. */
		return this.deleteManyByFilter(filter, options);
	}

	/**
	 * Удаление многих документов по фильтру.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {DeleteManyOptions<TModel>} options опции удаления
	 * @returns {Promise<DeleteResult>} данные о результате удаления
	 */
	public async deleteManyByFilter(
		filter: FilterMongo<TModel>,
		options?: DeleteManyOptions<TModel>
	): Promise<DeleteResultMongo> {
		/** Фильтр для поиска документов по фильтру. */
		const deleteOptions = this.buildDeleteOptions(options);
		/** Выполняем операцию с учётом фильтра и опций. */
		return this.col().deleteMany(filter, deleteOptions);
	}
}
