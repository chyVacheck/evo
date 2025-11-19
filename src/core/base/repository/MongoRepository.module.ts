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
	type Document,
	type Filter as FilterMongo,
	type WithId,
	type InsertOneResult as InsertOneResultMongo,
	type InsertManyResult as InsertManyResultMongo,
	type FindOptions as FindOptionsMongo,
	type CountOptions as CountOptionsMongo,
	type UpdateFilter as UpdateFilterMongo,
	type UpdateOptions as UpdateOptionsMongo,
	type UpdateResult as UpdateResultMongo,
	type FindOneAndUpdateOptions as ModifyOptionsMongo,
	type ModifyResult as ModifyResultMongo,
	type DeleteOptions as DeleteOptionsMongo,
	type DeleteResult as DeleteResultMongo,
	type OptionalUnlessRequiredId as OptionalUnlessRequiredIdMongo
} from 'mongodb';

/**
 * ! my imports
 */
import {
	type FindOneMongoOptionsRepo,
	type FindManyMongoOptionsRepo,
	type CountMongoOptionsRepo,
	type ExistsMongoOptionsRepo,
	type UpdateOneMongoOptionsRepo,
	type UpdateManyMongoOptionsRepo,
	type ModifyOneMongoOptionsRepo,
	type DeleteOneMongoOptionsRepo,
	type DeleteManyMongoOptionsRepo,
	type InsertOneMongoOptionsRepo,
	type InsertManyMongoOptionsRepo
} from '@core/types';
import { RepositoryModule } from '@core/base/repository/Repository.module';
import { MongoDatabase } from '@core/database';

/**
 * Базовый репозиторий для MongoDB.
 *
 * @typeParam TModel — Тип документа коллекции (расширяет `Document`).
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
		super(moduleName, collectionName, entityName);
		/** Менеджер подключения к MongoDB. */
		this.mongo = mongo;
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
	 * ? === === === UTILITIES === === ===
	 */

	/**
	 * * === === === Soft Delete === === ===
	 */

	// /**
	//  * @description
	//  * Проверка поддержки мягкого удаления.
	//  * @returns `true` если мягкое удаление поддерживается, иначе `false`.
	//  */
	// abstract supportsSoftDelete(): boolean;

	// /**
	//  * Что проставляем при soft-delete (например: $set { system.deletedAt: Date.now(), ... })
	//  * @param _ctx Контекст операции (например: actorId, now).
	//  */
	// abstract getSoftDeleteUpdate(_ctx?: {
	// 	actorId?: unknown;
	// 	now?: Date;
	// }): UpdateFilter<TModel>;

	// /**
	//  * Что проставляем при restore (например: $unset или $set { system.deletedAt: null, ... })
	//  * @param _ctx Контекст операции (например: actorId, now).
	//  */
	// abstract getRestoreUpdate(_ctx?: {
	// 	actorId?: unknown;
	// 	now?: Date;
	// }): UpdateFilter<TModel>;

	// /**
	//  * Фильтр «документы НЕ удалены» (например: { "system.deletedAt": null })
	//  */
	// abstract getNotDeletedFilter(): FilterMongo<TModel>;

	// /**
	//  * Фильтр «документы удалены» (например: { "system.deletedAt": { $ne: null } })
	//  */
	// abstract getDeletedFilter(): FilterMongo<TModel>;

	// /**
	//  * Индекс по флагу soft-delete (например: { "system.deletedAt": 1 })
	//  */
	// abstract getSoftDeleteFlagIndexSpec(): Document;

	// /**
	//  * @description
	//  * Применить видимость по флагу soft-delete к фильтру.
	//  * @param FilterMongo Базовый фильтр.
	//  * @param options Опции фильтрации.
	//  * @returns Фильтр с учётом видимости по флагу soft-delete.
	//  */
	// protected applySoftDeleteVisibility(
	// 	FilterMongo: FilterMongo<TModel>,
	// 	options?: { includeDeleted?: boolean; onlyDeleted?: boolean }
	// ): FilterMongo<TModel> {
	// 	/**
	// 	 * Если мягкое удаление не поддерживается, возвращаем фильтр без изменений.
	// 	 */
	// 	if (!this.supportsSoftDelete()) return FilterMongo;

	// 	/**
	// 	 * Если указано `onlyDeleted`, возвращаем фильтр с учётом удалённых документов.
	// 	 */
	// 	if (options?.onlyDeleted) {
	// 		return this.mergeAnd(FilterMongo, this.getDeletedFilter());
	// 	}

	// 	/**
	// 	 * Если указано `includeDeleted`, возвращаем фильтр без изменений.
	// 	 */
	// 	if (options?.includeDeleted) {
	// 		return FilterMongo;
	// 	}

	// 	/**
	// 	 * По умолчанию скрываем удалённые документы.
	// 	 */
	// 	return this.mergeAnd(FilterMongo, this.getNotDeletedFilter());
	// }

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
		o?: FindOneMongoOptionsRepo<TModel>,
		extra?: Pick<FindOptionsMongo, 'limit' | 'skip'>
	): FindOptionsMongo {
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
	protected buildCountOptions(
		o?: CountMongoOptionsRepo<TModel>
	): CountOptionsMongo {
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
		o?: UpdateOneMongoOptionsRepo<TModel>
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
		o?: ModifyOneMongoOptionsRepo<TModel>
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
		o?: DeleteOneMongoOptionsRepo<TModel>
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
			// todo: поменять на другую ошибку
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
		return this.mongo.getCollection<TModel>(this.getEntitiesGroup());
	}

	/**
	 * ! === === === CRUD === === ===
	 */

	/**
	 * ? === === === CREATE === === ===
	 */

	/**
	 * Вставка документа.
	 * @param {OptionalUnlessRequiredIdMongo<TModel>} doc документ для вставки
	 * @param {InsertOneMongoOptionsRepo<TModel>} options опции вставки (session, comment, bypassDocumentValidation и т.д.)
	 * @returns {Promise<WithId<TModel>>} вставленный документ (полностью, повторно прочитанный из БД)
	 */
	public async insertOne(
		doc: OptionalUnlessRequiredIdMongo<TModel>,
		options?: InsertOneMongoOptionsRepo<TModel>
	): Promise<InsertOneResultMongo<TModel>> {
		return await this.col().insertOne(doc, options);
	}

	/**
	 * Вставка нескольких документов.
	 * @param {ReadonlyArray<OptionalUnlessRequiredIdMongo<TModel>>} docs документы для вставки
	 * @param {InsertManyMongoOptionsRepo<TModel>} options опции вставки (session, comment, bypassDocumentValidation и т.д.)
	 * @returns {Promise<InsertManyResultMongo<TModel>>} вставленные документы (полностью, повторно прочитанные из БД)
	 */
	public async insertMany(
		docs: ReadonlyArray<OptionalUnlessRequiredIdMongo<TModel>>,
		options?: InsertManyMongoOptionsRepo<TModel>
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
	 * @param {FindOneMongoOptionsRepo<TModel>} options опции поиска
	 * @returns {WithId<TModel> | null} найденный документ или null
	 */
	public async findOneById(
		id: TModel['_id'],
		options?: FindOneMongoOptionsRepo<TModel>
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
		options?: FindOneMongoOptionsRepo<TModel>
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
		options: FindManyMongoOptionsRepo<TModel>
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
	 * @param {FindManyMongoOptionsRepo<TModel>} options опции поиска
	 * @returns {Promise<Array<WithId<TModel>>>} список документов или пустой массив
	 
	 */
	public async findManyByFilter(
		filter: FilterMongo<TModel>,
		options: FindManyMongoOptionsRepo<TModel>
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
	 * @param {ExistsMongoOptionsRepo<TModel>} options опции поиска
	 * @returns {boolean} true, если документ существует, иначе false
	 */
	public async existsByFilter(
		filter: FilterMongo<TModel>,
		options?: ExistsMongoOptionsRepo<TModel>
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
	 * @param {CountMongoOptionsRepo<TModel>} options опции подсчёта
	 * @returns {number} количество документов
	 */
	public async countByFilter(
		filter: FilterMongo<TModel>,
		options?: CountMongoOptionsRepo<TModel>
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
	 * @param {UpdateOneMongoOptionsRepo<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateOneById(
		id: TModel['_id'],
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: UpdateOneMongoOptionsRepo<TModel>
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
	 * @param {UpdateOneMongoOptionsRepo<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateOneByFilter(
		filter: FilterMongo<TModel>,
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: UpdateOneMongoOptionsRepo<TModel>
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
	 * @param {UpdateManyMongoOptionsRepo<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateManyByIds(
		ids: Array<TModel['_id']>,
		update: UpdateFilterMongo<TModel> | Array<Document>,
		options?: UpdateManyMongoOptionsRepo<TModel>
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
	 * @param {UpdateManyMongoOptionsRepo<TModel>} options опции обновления
	 * @returns {Promise<UpdateResult<TModel>>} результат обновления
	 */
	public async updateManyByFilter(
		filter: FilterMongo<TModel>,
		update: UpdateFilterMongo<TModel> | Array<Document>,
		options?: UpdateManyMongoOptionsRepo<TModel>
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
	 * @param {ModifyOneMongoOptionsRepo<TModel>} options опции обновления
	 * @returns {Promise<ModifyResult<TModel>>} данные о результате обновления
	 */
	public async modifyOneById(
		id: TModel['_id'],
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: ModifyOneMongoOptionsRepo<TModel>
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
	 * @param {ModifyOneMongoOptionsRepo<TModel>} options опции обновления
	 * @returns {Promise<ModifyResult<TModel>>} данные о результате обновления
	 */
	public async modifyOneByFilter(
		filter: FilterMongo<TModel>,
		update: UpdateFilterMongo<TModel> | Partial<TModel>,
		options?: ModifyOneMongoOptionsRepo<TModel>
	): Promise<ModifyResultMongo<TModel>> {
		/** Создание опций обновления. */
		const modifyOptions = this.buildModifyOptions(options);
		/** Вызов метода обновления по фильтру. */
		return await this.col().findOneAndUpdate(filter, update, {
			...modifyOptions,
			includeResultMetadata: true
		});
	}

	// /**
	//  * * === === === Restore === === ===
	//  */

	// /**
	//  * Проверка поддержки восстановления.
	//  */
	// private checkRestoreSupport(): void {
	// 	if (!this.supportsSoftDelete()) {
	// 		throw new Error('Restore is not supported');
	// 	}
	// }

	// /**
	//  * Восстановление одного документа по его идентификатору.
	//  * @param {TModel['_id']} id идентификатор документа
	//  * @param {UpdateOneOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async restoreOneById(
	// 	id: TModel['_id'],
	// 	options?: UpdateOneOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Создание обновления для мягкого удаления.
	// 	 */
	// 	const FilterMongo: FilterMongo<TModel> = { _id: id };
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.restoreOneByFilter(FilterMongo, options, ctx);
	// }

	// /**
	//  * Восстановление одного документа по фильтру.
	//  * @param {FilterMongo<TModel>} FilterMongo строго типизированный фильтр
	//  * @param {UpdateOneOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async restoreOneByFilter(
	// 	FilterMongo: FilterMongo<TModel>,
	// 	options?: UpdateOneOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Проверка поддержки восстановления.
	// 	 */
	// 	this.checkRestoreSupport();
	// 	/**
	// 	 * Создание фильтра для документа, который был мягко удален.
	// 	 */
	// 	const finalFilter: FilterMongo<TModel> = this.mergeAnd(
	// 		FilterMongo,
	// 		this.getDeletedFilter()
	// 	);
	// 	/**
	// 	 * Создание опций обновления.
	// 	 */
	// 	const update = this.getRestoreUpdate(ctx);
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.updateOneByFilter(finalFilter, update, options);
	// }

	// /**
	//  * Восстановление многих документов по фильтру.
	//  * @param {Array<TModel['_id']>} ids массив идентификаторов документов
	//  * @param {UpdateManyOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async restoreManyByIds(
	// 	ids: Array<TModel['_id']>,
	// 	options?: UpdateManyOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Создание обновления для мягкого удаления.
	// 	 */
	// 	const FilterMongo: FilterMongo<TModel> = { _id: { $in: ids } };
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.restoreManyByFilter(FilterMongo, options, ctx);
	// }

	// /**
	//  * Восстановление многих документов по фильтру.
	//  * @param {FilterMongo<TModel>} FilterMongo строго типизированный фильтр
	//  * @param {UpdateManyOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async restoreManyByFilter(
	// 	FilterMongo: FilterMongo<TModel>,
	// 	options?: UpdateManyOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Проверка поддержки восстановления.
	// 	 */
	// 	this.checkRestoreSupport();
	// 	/**
	// 	 * Создание фильтра для документов, которые были мягко удалены.
	// 	 */
	// 	const finalFilter: FilterMongo<TModel> = this.mergeAnd(
	// 		FilterMongo,
	// 		this.getDeletedFilter()
	// 	);
	// 	/**
	// 	 * Создание опций обновления.
	// 	 */
	// 	const update = this.getRestoreUpdate(ctx);
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.updateManyByFilter(finalFilter, update, options);
	// }

	// /**
	//  * * === === === Soft Delete === === ===
	//  */

	// /**
	//  * Проверка поддержки мягкого удаления.
	//  */
	// private checkSoftDeleteSupport(): void {
	// 	if (!this.supportsSoftDelete()) {
	// 		throw new Error('Soft delete is not supported');
	// 	}
	// }

	// /**
	//  * Soft-delete одного документа по его идентификатору.
	//  * @param {TModel['_id']} id идентификатор документа
	//  * @param {UpdateOneOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async softDeleteOneById(
	// 	id: TModel['_id'],
	// 	options?: UpdateOneOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Создание обновления для мягкого удаления.
	// 	 */
	// 	const FilterMongo: FilterMongo<TModel> = { _id: id };
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.softDeleteOneByFilter(FilterMongo, options, ctx);
	// }

	// /**
	//  * Soft-delete одного документа по фильтру (первый документ).
	//  * @param {FilterMongo<TModel>} FilterMongo строго типизированный фильтр
	//  * @param {UpdateOneOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async softDeleteOneByFilter(
	// 	FilterMongo: FilterMongo<TModel>,
	// 	options?: UpdateOneOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Проверка поддержки мягкого удаления.
	// 	 */
	// 	this.checkSoftDeleteSupport();
	// 	/**
	// 	 * Создание фильтра для мягкого удаления.
	// 	 */
	// 	const finalFilter: FilterMongo<TModel> = this.mergeAnd(
	// 		FilterMongo,
	// 		this.getNotDeletedFilter()
	// 	);
	// 	/**
	// 	 * Создание обновления для мягкого удаления.
	// 	 */
	// 	const update = this.getSoftDeleteUpdate(ctx);
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.updateOneByFilter(finalFilter, update, options);
	// }

	// /**
	//  * Soft-delete многих документов по их идентификаторам.
	//  * @param {Array<TModel['_id']>} ids массив идентификаторов документов
	//  * @param {UpdateManyOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async softDeleteManyByIds(
	// 	ids: Array<TModel['_id']>,
	// 	options?: UpdateManyOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Создание обновления для мягкого удаления.
	// 	 */
	// 	const FilterMongo: FilterMongo<TModel> = { _id: { $in: ids } };
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.softDeleteManyByFilter(FilterMongo, options, ctx);
	// }

	// /**
	//  * Soft-delete многих документов по фильтру.
	//  * @param {FilterMongo<TModel>} FilterMongo строго типизированный фильтр
	//  * @param {UpdateManyOptions<TModel>} options опции обновления
	//  * @param {Context} ctx контекст выполнения
	//  * @returns {Promise<UpdateResult<TModel>>} данные о результате обновления
	//  */
	// public async softDeleteManyByFilter(
	// 	FilterMongo: FilterMongo<TModel>,
	// 	options?: UpdateManyOptions<TModel>,
	// 	ctx?: { actorId?: TId; now?: Date }
	// ): Promise<UpdateResult<TModel>> {
	// 	/**
	// 	 * Проверка поддержки мягкого удаления.
	// 	 */
	// 	this.checkSoftDeleteSupport();
	// 	/**
	// 	 * Создание фильтра для мягкого удаления.
	// 	 */
	// 	const finalFilter: FilterMongo<TModel> = this.mergeAnd(
	// 		FilterMongo,
	// 		this.getNotDeletedFilter()
	// 	);
	// 	/**
	// 	 * Создание обновления для мягкого удаления.
	// 	 */
	// 	const update = this.getSoftDeleteUpdate(ctx);
	// 	/**
	// 	 * Вызов метода обновления по фильтру.
	// 	 */
	// 	return this.updateManyByFilter(finalFilter, update, options);
	// }

	/**
	 * ? === === === DELETE === === ===
	 */

	/**
	 * Удаление одного документа по его идентификатору.
	 * @param {TModel['_id']} id идентификатор документа
	 * @param {DeleteOneMongoOptionsRepo<TModel>} options опции удаления
	 * @returns {Promise<DeleteResultMongo>} данные о результате удаления
	 */
	public async deleteOneById(
		id: TModel['_id'],
		options?: DeleteOneMongoOptionsRepo<TModel>
	): Promise<DeleteResultMongo> {
		/** Создание фильтра по идентификатору. */
		const filter: FilterMongo<TModel> = { _id: id };
		/** Вызов метода удаления по фильтру. */
		return this.deleteOneByFilter(filter, options);
	}

	/**
	 * Удаление одного документа по фильтру.
	 * @param {FilterMongo<TModel>} filter строго типизированный фильтр
	 * @param {DeleteOneMongoOptionsRepo<TModel>} options опции удаления
	 * @returns {Promise<DeleteResultMongo>} данные о результате удаления
	 */
	public async deleteOneByFilter(
		filter: FilterMongo<TModel>,
		options?: DeleteOneMongoOptionsRepo<TModel>
	): Promise<DeleteResultMongo> {
		/** Фильтр для поиска. */
		const deleteOptions = this.buildDeleteOptions(options);
		/** Выполняем операцию с учётом фильтра и опций. */
		return this.col().deleteOne(filter, deleteOptions);
	}

	/**
	 * Удаление многих документов по фильтру.
	 * @param {Array<TModel['_id']>} ids массив идентификаторов документов
	 * @param {DeleteManyMongoOptionsRepo<TModel>} options опции удаления
	 * @returns {Promise<DeleteResultMongo>} данные о результате удаления
	 */
	public async deleteManyByIds(
		ids: Array<TModel['_id']>,
		options?: DeleteManyMongoOptionsRepo<TModel>
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
	 * @param {DeleteManyMongoOptionsRepo<TModel>} options опции удаления
	 * @returns {Promise<DeleteResultMongo>} данные о результате удаления
	 */
	public async deleteManyByFilter(
		filter: FilterMongo<TModel>,
		options?: DeleteManyMongoOptionsRepo<TModel>
	): Promise<DeleteResultMongo> {
		/** Фильтр для поиска документов по фильтру. */
		const deleteOptions = this.buildDeleteOptions(options);
		/** Выполняем операцию с учётом фильтра и опций. */
		return this.col().deleteMany(filter, deleteOptions);
	}
}

/** {@inheritDoc IRepositoryModule.upsert} */
// async upsert(
// 	FilterMongo: FilterMongo<TModel>,
// 	createData: TModel,
// 	updateData?: TUpdate,
// 	opts?: TRepoCommonOpts
// ): Promise<{ created: boolean; affected: number }> {
// 	const driver = this.mergeDriver(opts);
// 	const res = await this.col().updateOne(
// 		FilterMongo,
// 		(updateData ?? (createData as unknown)) as UpdateFilter<TModel>,
// 		{ upsert: true, ...this.driverOpts(driver) }
// 	);
// 	const created = Boolean(res.upsertedCount);
// 	const affected = (res.upsertedCount ?? 0) + (res.modifiedCount ?? 0);
// 	// Если создаём — нужно записать createData целиком (updateOne с $set предпочтительнее)
// 	if (created && !updateData) {
// 		// ничего дополнительного не делаем: upsert уже создал документ
// 	}
// 	return { created, affected };
// }

/** {@inheritDoc IRepositoryModule.upsertOneById} */
// async upsertOneById(
// 	id: TId,
// 	createData: TModel,
// 	updateData?: TUpdate,
// 	opts?: TRepoCommonOpts
// ): Promise<{ created: boolean; affected: number }> {
// 	const FilterMongo = this.idFilter(id);
// 	// если создаём — проставим _id сразу
// 	const dataWithId = {
// 		...(createData as object),
// 		[this.idField]: this.normalizeId(id)
// 	} as TModel;
// 	return this.upsert(FilterMongo, dataWithId, updateData, opts);
// }

/** {@inheritDoc IRepositoryModule.bulk} */
// async bulk(
// 	operations: AnyBulkWriteOperation<TModel>[],
// 	opts?: TRepoCommonOpts
// ): Promise<unknown> {
// 	if (operations.length === 0) return { ok: 1, n: 0 };
// 	const driver = this.mergeDriver(opts);
// 	return this.col().bulkWrite(operations, {
// 		ordered: false,
// 		...this.driverOpts(driver)
// 	});
// }

/**
 * @inheritDoc {IRepositoryModule.aggregate}
 */
// async aggregate<TRow extends Document = TModel>(
// 	pipeline: Array<Document> | Document,
// 	opts?: TRepoCommonOpts
// ): Promise<TRow[]> {
// 	const driver = this.mergeDriver(opts);
// 	const arr = Array.isArray(pipeline) ? pipeline : [pipeline];
// 	const cursor = this.col().aggregate<TRow>(arr, {
// 		session: driver.session,
// 		maxTimeMS: driver.maxTimeMS
// 	} as AggregateOptions);
// 	return cursor.toArray();
// }

/** {@inheritDoc IRepositoryModule.transaction} */
// async transaction<R>(
// 	fn: (trx: ClientSession) => Promise<R>,
// 	opts?: TRepoCommonOpts
// ): Promise<R> {
// 	const external = (opts?.driver as TMongoDriverOpts | undefined)?.session;
// 	const session = external ?? this.mongo.startSession();
// 	const shouldEnd = !external;

// 	try {
// 		let result!: R;
// 		await session.withTransaction(async () => {
// 			result = await fn(session);
// 		});
// 		return result;
// 	} catch (e) {
// 		throw new Error(`Mongo transaction failed: ${(e as Error).message}`);
// 	} finally {
// 		if (shouldEnd) await session.endSession();
// 	}
// }
