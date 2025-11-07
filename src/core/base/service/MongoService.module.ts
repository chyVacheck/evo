/**
 * @file Service.module.ts
 * @module core/base
 *
 * @description
 * Базовый абстрактный класс для всех сервисных модулей приложения.
 *
 * @see EModuleType
 *
 * @example
 * class SomeCustomModule extends ServiceModule {
 *   constructor() {
 *     super(EModuleType.SERVICE, 'SomeService');
 *   }
 * }
 */

/**
 * ! lib imports
 */
import {
	Filter as FilterMongo,
	UpdateFilter as UpdateFilterMongo,
	OptionalUnlessRequiredId,
	WithId
} from 'mongodb';

/**
 * ! my imports
 */
import { ServiceModule } from '@core/base/service/Service.module';
import { ServiceResponse } from '@core/base/service/ServiceResponse';
import { MongoRepository } from '@core/base/repository';
import {
	EntityNotFoundException,
	InvalidPaginationLimitException,
	RepositoryWriteException,
	UnsafeOperationException
} from '@core/exceptions';
import {
	CountOptions,
	CreateManyOptions,
	CreateOneOptions,
	DeleteManyOptions,
	DeleteOneOptions,
	ExistsOptions,
	FindManyOptions,
	FindOneOptions,
	ModifyOneOptions,
	ServiceMeta,
	UpdateManyOptions,
	UpdateOneOptions
} from '@core/types/service';
import { BaseDoc, ProjectionFor } from '@core/types';

/**
 * @description
 * Абстрактный класс, описывающий базовые свойства всех сервисных модулей:
 * тип и имя модуля. Используется как фундамент для логгирования и архитектурного разграничения.
 */
export abstract class MongoServiceModule<
	TModel extends BaseDoc
> extends ServiceModule {
	/**
	 * Репозиторий для работы с MongoDB.
	 */
	protected repo: MongoRepository<TModel>;

	/**
	 * Имя для исключений.
	 */
	protected readonly origin: string;

	/**
	 * Базовый конструктор MongoService-модуля.
	 *
	 * @param moduleName - Название модуля
	 */
	constructor(moduleName: string, repo: MongoRepository<TModel>) {
		super(moduleName);

		this.repo = repo;
		/** Имя для исключений. */
		this.origin = this.getModuleName();
	}

	/**
	 * ! === === === Protected === === ===
	 */

	/**
	 * @description
	 * Метод для пагинации.
	 *
	 * @param total - Общее количество элементов
	 * @param page - Номер страницы (1+)
	 * @param limit - Сколько вернуть элементов (обязательный лимит) (1+)
	 *
	 * @returns Объект с пагинацией
	 *
	 * @throws InvalidPaginationLimitException - Если лимит меньше или равен 0
	 */
	protected paginate(total: number, page: number, limit: number) {
		if (limit <= 0) {
			const err = new InvalidPaginationLimitException({
				message: `Limit can not be: ${limit}, must be more than 0`,
				origin: this.origin,
				details: { limit }
			});
			this.error({
				message: `Limit can not be: ${limit}, must be more than 0`,
				error: err
			});
			throw err;
		}
		const totalPages = Math.ceil(total / limit);
		return { page, total, limit, totalPages };
	}

	/**
	 * @description
	 * Метод для получения безопасных данной пагинации для репозитория.
	 *
	 * @param page - Номер страницы (1+)
	 * @param limit - Сколько вернуть элементов (обязательный лимит) (1+)
	 *
	 * @returns Объект с безопасной пагинацией
	 */
	protected safePaginate(page?: number, limit?: number) {
		const safePage = Math.max(1, page || 1);
		const safeLimit = Math.max(1, limit || 1);
		const skip = (safePage - 1) * safeLimit;
		return { page: safePage, skip, limit: safeLimit };
	}

	/**
	 * ! === === === CRUD === === ===
	 */

	/**
	 * ? === === === CREATE === === ===
	 */

	/**
	 * @description
	 * Метод для преобразования опций поиска в опции репозитория.
	 *
	 * @param options - Опции поиска
	 * @param meta - Метаданные сервиса
	 *
	 * @returns Опции репозитория
	 */
	private toRepoInsertOpts(
		options: CreateOneOptions<TModel> | CreateManyOptions<TModel> | undefined,
		meta: ServiceMeta
	) {
		return {
			...options,
			session: meta.session,
			comment: meta.requestId // критично: привязываем запрос ко всем операциям в логе Mongo
		};
	}

	/**
	 * @description
	 * Создаёт новую сущность в базе и возвращает только её идентификатор.
	 *
	 * @param {Object} params - Параметры создания сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {OptionalUnlessRequiredId<TModel>} params.data - Данные для создания сущности
	 * @param {CreateOneOptions<TModel>} params.options - Опции создания сущности
	 *
	 * @returns Идентификатор созданной сущности
	 */
	public async insertOne({
		meta,
		data,
		options
	}: {
		meta: ServiceMeta;
		data: OptionalUnlessRequiredId<TModel>;
		options?: CreateOneOptions<TModel>;
	}): Promise<ServiceResponse<TModel['_id']>> {
		/** Преобразуем опции в опции репозитория. */
		const repoOpts = this.toRepoInsertOpts(options, meta);
		const resp = await this.repo.insertOne(data, repoOpts);

		// Если операция вставки не была подтверждена, то выбрасываем исключение.
		if (resp.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Insert not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { data }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not inserted`,
				details: { data, options },
				error: err
			});
			throw err;
		}

		return ServiceResponse.created(resp.insertedId as TModel['_id']);
	}

	/**
	 * @description
	 * Создаёт новые сущности в базе и возвращает только их идентификаторы.
	 *
	 * @param {Object} params - Параметры создания сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {Array<OptionalUnlessRequiredId<TModel>>} params.data - Данные для создания сущности
	 * @param {CreateManyOptions<TModel>} params.options - Опции создания сущности
	 *
	 * @returns Идентификаторы созданных сущностей
	 */
	public async insertMany({
		meta,
		data,
		options
	}: {
		meta: ServiceMeta;
		data: Array<OptionalUnlessRequiredId<TModel>>;
		options?: CreateManyOptions<TModel>;
	}): Promise<ServiceResponse<Array<TModel['_id']>>> {
		/** Преобразуем опции в опции репозитория. */
		const repoOpts = this.toRepoInsertOpts(options, meta);
		const resp = await this.repo.insertMany(data, repoOpts);

		// Если операция вставки не была подтверждена, то выбрасываем исключение.
		if (resp.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Insert not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { data }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not inserted`,
				details: { data, options },
				error: err
			});
			throw err;
		}

		const ids = Object.values(resp.insertedIds) as Array<TModel['_id']>;
		return ServiceResponse.created(ids);
	}

	/**
	 * @description
	 * Метод для создания одной сущности в репозитории.
	 *
	 * @param {Object} params - Параметры создания сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {OptionalUnlessRequiredId<TModel>} params.data - Данные для создания сущности
	 * @param {CreateOneOptions<TModel>} params.options - Опции создания сущности
	 *
	 * @returns Созданная сущность
	 *
	 * @throws RepositoryWriteException - Если операция вставки не была подтверждена
	 */
	public async createOne({
		meta,
		data,
		options
	}: {
		meta: ServiceMeta;
		data: OptionalUnlessRequiredId<TModel>;
		options?: CreateOneOptions<TModel>;
	}): Promise<ServiceResponse<WithId<TModel>>> {
		const repoInsertOpts = this.toRepoInsertOpts(options, meta);
		/** Создаем сущность в репозитории. */
		const resp = await this.repo.insertOne(data, repoInsertOpts);

		// Если операция вставки не была подтверждена, то выбрасываем исключение.
		if (resp.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Insert not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { data }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not inserted`,
				details: { data, options },
				error: err
			});
			throw err;
		}

		// Получаем созданную сущность по её идентификатору.
		const entity = await this._getOneById({
			id: resp.insertedId as TModel['_id'],
			meta
		});

		return ServiceResponse.created(entity);
	}

	/**
	 * @description
	 * Метод для создания нескольких сущностей в репозитории.
	 *
	 * @param meta - Метаданные сервиса
	 * @param data - Данные для создания сущностей
	 * @param options - Опции создания сущностей
	 *
	 * @returns Созданные сущности
	 *
	 * @throws RepositoryWriteException - Если операция вставки не была подтверждена
	 */
	public async createMany({
		meta,
		data,
		options
	}: {
		meta: ServiceMeta;
		data: Array<OptionalUnlessRequiredId<TModel>>;
		options?: CreateManyOptions<TModel>;
	}): Promise<ServiceResponse<Array<WithId<TModel>>>> {
		/** Создаем сущности в репозитории. */
		const resp = await this.repo.insertMany(
			data,
			this.toRepoInsertOpts(options, meta)
		);

		// Если операция вставки не была подтверждена, то выбрасываем исключение.
		if (resp.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Insert not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { data }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not inserted`,
				details: { data, options },
				error: err
			});
			throw err;
		}

		const ids = Object.values(resp.insertedIds) as Array<TModel['_id']>;
		/** Получаем созданные сущности по их идентификаторам. */
		return await this.getManyByIds({
			meta,
			options: {
				page: 1,
				limit: ids.length
			},
			ids
		});
	}

	/**
	 * ? === === === READ === === ===
	 */

	/**
	 * @description
	 * Метод для преобразования опций поиска в опции репозитория.
	 *
	 * @param options - Опции поиска
	 * @param meta - Метаданные сервиса
	 *
	 * @returns Опции репозитория
	 */
	private toRepoFindOpts(
		options: FindOneOptions<TModel> | FindManyOptions<TModel> | undefined,
		meta: ServiceMeta
	) {
		return {
			...options,
			session: meta.session,
			comment: meta.requestId // критично: привязываем запрос ко всем операциям в логе Mongo
		};
	}

	/**
	 * @description
	 * Метод для получения одной сущности по её идентификатору.
	 *
	 * @param id - Идентификатор сущности
	 * @param options - Опции поиска
	 * @param meta - Метаданные сервиса
	 *
	 * @returns Сущность, найденная по идентификатору
	 *
	 * @throws EntityNotFoundException - Если сущность с указанным идентификатором не найдена
	 */
	protected async _getOneById({
		id,
		options,
		meta
	}: {
		id: TModel['_id'];
		options?: FindOneOptions<TModel>;
		meta: ServiceMeta;
	}): Promise<WithId<TModel>> {
		const entity = await this.repo.findOneById(
			id,
			this.toRepoFindOpts(options, meta)
		);
		// Если сущность не найдена, то выбрасываем исключение.
		if (entity === null) {
			const err = new EntityNotFoundException({
				message: `${this.repo.getEntityName()} not found`,
				origin: this.origin,
				details: { id, options }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not found`,
				details: { id, options },
				error: err
			});
			throw err;
		}
		return entity;
	}

	/**
	 * @description
	 * Метод для получения одной сущности по её идентификатору.
	 *
	 * @param id - Идентификатор сущности
	 * @param options - Опции поиска
	 *
	 * @returns Сущность, найденная по идентификатору
	 *
	 * @throws EntityNotFoundException - Если сущность с указанным идентификатором не найдена
	 */
	public async getOneById({
		id,
		options,
		meta
	}: {
		id: TModel['_id'];
		options?: FindOneOptions<TModel>;
		meta: ServiceMeta;
	}): Promise<ServiceResponse<WithId<TModel>>> {
		const entity = await this._getOneById({ id, options, meta });

		/** Возвращаем сущность в ответе. */
		return ServiceResponse.founded(entity);
	}

	/**
	 * @description
	 * Метод для получения одной сущности по фильтру.
	 *
	 * @param filter - Фильтр для поиска сущности
	 * @param options - Опции поиска
	 *
	 * @returns Сущность, найденная по фильтру
	 *
	 * @throws EntityNotFoundException - Если сущность с указанным фильтром не найдена
	 */
	public async getOneByFilter({
		filter,
		options,
		meta
	}: {
		filter: FilterMongo<TModel>;
		options?: FindOneOptions<TModel>;
		meta: ServiceMeta;
	}): Promise<ServiceResponse<WithId<TModel>>> {
		const entity = await this.repo.findOneByFilter(
			filter,
			this.toRepoFindOpts(options, meta)
		);

		// Если сущность не найдена, то выбрасываем исключение.
		if (entity === null) {
			const err = new EntityNotFoundException({
				message: `${this.repo.getEntityName()} not found`,
				origin: this.origin,
				details: { filter, options }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not found`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем сущность в ответе. */
		return ServiceResponse.founded(entity);
	}

	/**
	 * @description
	 * Метод для получения нескольких сущностей по их идентификаторам.
	 *
	 * @param ids - Список идентификаторов сущностей
	 * @param options - Опции поиска
	 *
	 * @returns Список сущностей, найденных по идентификаторам
	 */
	public async getManyByIds({
		meta,
		ids,
		options
	}: {
		meta: ServiceMeta;
		ids: Array<TModel['_id']>;
		options: FindManyOptions<TModel>;
	}): Promise<ServiceResponse<Array<WithId<TModel>>>> {
		const { page, limit, skip } = this.safePaginate(
			options.page,
			options.limit
		);

		// Если список идентификаторов пустой, то возвращаем пустой массив.
		if (ids.length === 0) {
			return ServiceResponse.founded<Array<WithId<TModel>>>([]).setPagination(
				this.paginate(0, page, limit)
			);
		}

		// Если указано сохранение порядка, то добавляем _id в проекцию.
		const svcOpts = options?.saveOrder
			? {
					...options,
					projection: {
						...(options.projection ?? {}),
						_id: 1
					} as ProjectionFor<TModel>
			  }
			: options;

		// Преобразуем опции поиска в опции репозитория.
		const repoOpts = this.toRepoFindOpts(svcOpts, meta);
		let entities = await this.repo.findManyByIds(ids, {
			...repoOpts,
			limit,
			skip
		});

		/**
		 * @todo решить проблему с передачей в projection _id: 0
		 * Если указано сохранение порядка, то сортируем сущности по порядку их идентификаторов.
		 */
		if (svcOpts?.saveOrder) {
			const map = new Map(entities.map(e => [String(e._id), e]));
			const ordered = ids
				.map(id => map.get(String(id)))
				.filter(Boolean) as Array<WithId<TModel>>;
			entities = ordered;
		}

		// Преобразуем опции поиска в опции репозитория.
		const repoCountOpts = this.toRepoCountOpts(options, meta);
		// Вычисляем общее количество сущностей по фильтру.
		const total = await this.repo.countByFilter(
			{ _id: { $in: ids } } as FilterMongo<TModel>,
			repoCountOpts
		);

		/** Возвращаем сущности в ответе. */
		return ServiceResponse.founded(entities).setPagination(
			this.paginate(total, page, limit)
		);
	}

	/**
	 * @description
	 * Метод для получения нескольких сущностей по фильтру.
	 *
	 * @param filter - Фильтр для поиска сущностей
	 * @param options - Опции поиска
	 *
	 * @returns Список сущностей, найденных по фильтру
	 */
	public async getManyByFilter({
		meta,
		filter,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		options: FindManyOptions<TModel>;
	}): Promise<ServiceResponse<Array<WithId<TModel>>>> {
		const { page, limit, skip } = this.safePaginate(
			options.page,
			options.limit
		);

		// Преобразуем опции поиска в опции репозитория.
		const repoOpts = this.toRepoFindOpts(options, meta);
		// Выполняем поиск сущностей по фильтру.
		const entities = await this.repo.findManyByFilter(filter, {
			...repoOpts,
			limit,
			skip
		});

		// Если сущности не найдены, то возвращаем пустой массив.
		if (entities.length === 0) {
			return ServiceResponse.founded<Array<WithId<TModel>>>([]).setPagination(
				this.paginate(0, page, limit)
			);
		}

		// Преобразуем опции поиска в опции репозитория.
		const repoCountOpts = this.toRepoCountOpts(options, meta);
		// Вычисляем общее количество сущностей по фильтру.
		const total = await this.repo.countByFilter(filter, repoCountOpts);

		/** Возвращаем сущности в ответе. */
		return ServiceResponse.founded(entities).setPagination(
			this.paginate(total, page, limit)
		);
	}

	/**
	 * * === === === Exists === === ===
	 */

	/**
	 * @description
	 * Метод для преобразования опций проверки существования сущности в опции репозитория.
	 *
	 * @param options - Опции проверки существования сущности
	 * @param meta - Метаданные сервиса
	 *
	 * @returns Опции репозитория
	 */
	private toRepoExistOpts(
		options: ExistsOptions<TModel> | undefined,
		meta: ServiceMeta
	) {
		return {
			...options,
			session: meta.session,
			comment: meta.requestId // критично: привязываем запрос ко всем операциям в логе Mongo
		};
	}

	/**
	 * @description
	 * Метод для проверки существования сущности по фильтру.
	 *
	 * @param {Object} params - Параметры проверки существования сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {FilterMongo<TModel>} params.filter - Фильтр для поиска сущности
	 * @param {ExistsOptions<TModel>} params.options - Опции проверки существования сущности
	 *
	 * @returns {Promise<ServiceResponse<boolean>>} Результат проверки существования сущности по фильтру
	 */
	public async existsByFilter({
		meta,
		filter,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		options?: ExistsOptions<TModel>;
	}): Promise<ServiceResponse<boolean>> {
		/** Преобразуем опции проверки существования сущности в опции репозитория. */
		const repoOpts = this.toRepoExistOpts(options, meta);
		/** Проверяем существование сущности по фильтру. */
		const exists = await this.repo.existsByFilter(filter, repoOpts);
		/** Возвращаем результат проверки существования сущности в ответе. */
		return ServiceResponse.founded<boolean>(exists);
	}

	/**
	 * * === === === Count === === ===
	 */

	/**
	 * @description
	 * Метод для преобразования опций подсчета количества сущностей в опции репозитория.
	 *
	 * @param options - Опции подсчета количества сущностей
	 * @param meta - Метаданные сервиса
	 *
	 * @returns Опции репозитория
	 */
	private toRepoCountOpts(
		options: CountOptions<TModel> | undefined,
		meta: ServiceMeta
	) {
		return {
			...options,
			session: meta.session,
			comment: meta.requestId // критично: привязываем запрос ко всем операциям в логе Mongo
		};
	}

	/**
	 * @description
	 * Метод для подсчета количества сущностей по фильтру.
	 *
	 * @param filter - Фильтр для поиска сущностей
	 * @param options - Опции поиска
	 *
	 * @returns Количество сущностей, найденных по фильтру
	 */
	public async countByFilter({
		meta,
		filter,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		options?: CountOptions<TModel>;
	}) {
		/** Преобразуем опции подсчета количества сущностей в опции репозитория. */
		const repoOpts = this.toRepoCountOpts(options, meta);
		/** Подсчитываем количество сущностей по фильтру. */
		const count = await this.repo.countByFilter(filter, repoOpts);
		/** Возвращаем результат подсчета в ответе. */
		return ServiceResponse.counted(count);
	}

	/**
	 * ? === === === UPDATE === === ===
	 */

	/**
	 * * === === === Update === === ===
	 */

	/**
	 * @description
	 * Метод для преобразования опций обновления сущности в опции репозитория.
	 *
	 * @param {Object} params - Параметры обновления сущности
	 * @param {UpdateOptions<TModel>} params.options - Опции обновления сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 *
	 * @returns Опции репозитория
	 */
	private toRepoUpdateOpts(
		options: UpdateOneOptions<TModel> | UpdateManyOptions<TModel> | undefined,
		meta: ServiceMeta
	) {
		return {
			...options,
			session: meta.session,
			comment: meta.requestId // критично: привязываем запрос ко всем операциям в логе Mongo
		};
	}

	/**
	 * @description
	 * Метод для обновления одной сущности по идентификатору.
	 *
	 * @param {Object} params - Параметры обновления сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {TModel['_id']} params.id - Идентификатор сущности
	 * @param {UpdateFilterMongo<TModel> | Partial<TModel>} params.update - Обновление сущности
	 * @param {UpdateOptions<TModel>} params.options - Опции обновления сущности
	 *
	 * @returns {Promise<ServiceResponse<number>>} Результат обновления сущности по идентификатору
	 */
	public async updateOneById({
		meta,
		id,
		update,
		options
	}: {
		meta: ServiceMeta;
		id: TModel['_id'];
		update: UpdateFilterMongo<TModel> | Partial<TModel>;
		options?: CountOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		/** Преобразуем опции обновления сущности в опции репозитория. */
		const repoOpts = this.toRepoUpdateOpts(options, meta);
		/** Обновляем сущность по идентификатору. */
		const updateRes = await this.repo.updateOneById(id, update, repoOpts);

		// Если операция обновления не была подтверждена, то выбрасываем исключение.
		if (updateRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Update not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { id }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { id, options },
				error: err
			});
			throw err;
		}

		// Если сущность не обновлена, то выбрасываем исключение.
		if (updateRes.upsertedCount === 0) {
			const err = new EntityNotFoundException({
				message: `${this.repo.getEntityName()} not found`,
				origin: this.origin,
				details: { id }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { id, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество обновленных сущностей в ответе. */
		return ServiceResponse.updated(updateRes.upsertedCount);
	}

	/**
	 * @description
	 * Метод для обновления одной сущности по фильтру.
	 *
	 * @param {Object} params - Параметры обновления сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {FilterMongo<TModel>} params.filter - Фильтр для поиска сущности
	 * @param {UpdateFilterMongo<TModel> | Partial<TModel>} params.update - Обновление сущности
	 * @param {UpdateOptions<TModel>} params.options - Опции обновления сущности
	 *
	 * @returns Количество обновленных сущностей по фильтру
	 *
	 * @throws EntityNotFoundException - Если сущность не обновлена
	 */
	public async updateOneByFilter({
		meta,
		filter,
		update,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		update: UpdateFilterMongo<TModel> | Partial<TModel>;
		options?: UpdateOneOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		/** Преобразуем опции обновления сущности в опции репозитория. */
		const repoOpts = this.toRepoUpdateOpts(options, meta);
		const updateRes = await this.repo.updateOneByFilter(
			filter,
			update,
			repoOpts
		);

		// Если операция обновления не была подтверждена, то выбрасываем исключение.
		if (updateRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Update not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { filter }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		// Если сущность не обновлена, то выбрасываем исключение.
		if (updateRes.upsertedCount === 0) {
			// Если сущность не обновлена, то выбрасываем исключение.
			const err = new EntityNotFoundException({
				message: `${this.repo.getEntityName()} not found`,
				origin: this.origin,
				details: { filter }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество обновленных сущностей в ответе. */
		return ServiceResponse.updated(updateRes.upsertedCount);
	}

	/**
	 * @description
	 * Метод для обновления сущностей по идентификаторам.
	 *
	 * @param {Object} params - Параметры обновления сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {Array<TModel['_id']>} params.ids - Идентификаторы сущностей
	 * @param {UpdateFilterMongo<TModel> | Partial<TModel>} params.update - Обновление сущности
	 * @param {UpdateOptions<TModel>} params.options - Опции обновления сущности
	 *
	 * @returns Количество обновленных сущностей по идентификаторам
	 *
	 * @throws EntityNotFoundException - Если сущность не обновлена
	 */
	public async updateManyByIds({
		meta,
		ids,
		update,
		options
	}: {
		meta: ServiceMeta;
		ids: Array<TModel['_id']>;
		update: UpdateFilterMongo<TModel> | Partial<TModel>;
		options?: DeleteManyOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		// Если список идентификаторов пуст, то возвращаем 0 удаленных сущностей.
		if (ids.length === 0) {
			return ServiceResponse.deleted(0);
		}
		/** Преобразуем опции обновления сущностей в опции репозитория. */
		const repoOpts = this.toRepoUpdateOpts(options, meta);
		const updateRes = await this.repo.updateManyByIds(ids, update, repoOpts);

		// Если операция обновления не была подтверждена, то выбрасываем исключение.
		if (updateRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Update not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { ids }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { ids, options },
				error: err
			});
			throw err;
		}

		// Если сущности не обновлены, то выбрасываем исключение.
		if (updateRes.modifiedCount === 0) {
			const err = new EntityNotFoundException({
				message: `No ${this.repo.getEntityName()} matched for update`,
				origin: this.origin,
				details: { ids }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { ids, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество обновленных сущностей в ответе. */
		return ServiceResponse.updated(updateRes.modifiedCount);
	}

	/**
	 * @description
	 * Метод для удаления сущностей по фильтру.
	 *
	 * @param {Object} params - Параметры удаления сущности по фильтру
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {FilterMongo<TModel>} params.filter - Фильтр для поиска сущностей
	 * @param {UpdateFilterMongo<TModel> | Partial<TModel>} params.update - Обновление сущности
	 * @param {UpdateOptions<TModel>} params.options - Опции обновления сущности
	 *
	 * @returns Количество обновленных сущностей по фильтру
	 *
	 * @throws EntityNotFoundException - Если сущность не обновлена
	 */
	public async updateManyByFilter({
		meta,
		filter,
		update,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		update: UpdateFilterMongo<TModel> | Partial<TModel>;
		options?: UpdateManyOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		/** Преобразуем опции обновления сущностей в опции репозитория. */
		const repoOpts = this.toRepoUpdateOpts(options, meta);
		const updateRes = await this.repo.updateManyByFilter(
			filter,
			update,
			repoOpts
		);

		// Если операция обновления не была подтверждена, то выбрасываем исключение.
		if (updateRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Update not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { filter }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		// Если сущности не обновлены, то выбрасываем исключение.
		if (updateRes.modifiedCount === 0) {
			const err = new EntityNotFoundException({
				message: `No ${this.repo.getEntityName()} matched for update`,
				origin: this.origin,
				details: { filter, options }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not updated`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество обновленных сущностей в ответе. */
		return ServiceResponse.updated(updateRes.modifiedCount);
	}

	/**
	 * * === === === Modify === === ===
	 */

	/**
	 * @description
	 * Метод для преобразования опций обновления сущности в опции репозитория.
	 *
	 * @param {Object} params - Параметры обновления сущности
	 * @param {UpdateOptions<TModel>} params.options - Опции обновления сущности
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 *
	 * @returns Опции репозитория
	 */
	private toRepoModifyOpts(
		options: ModifyOneOptions<TModel> | undefined,
		meta: ServiceMeta
	) {
		return {
			...options,
			session: meta.session,
			comment: meta.requestId // критично: привязываем запрос ко всем операциям в логе Mongo
		};
	}

	/**
	 * @description
	 * Метод для модификации сущности по идентификатору.
	 *
	 * @param {Object} params - Параметры модификации сущности по идентификатору
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {TModel['_id']} params.id - Идентификатор сущности
	 * @param {UpdateFilterMongo<TModel> | Partial<TModel>} params.update - Обновление сущности
	 * @param {ModifyOneOptions<TModel>} params.options - Опции обновления сущности
	 *
	 * @returns Модифицированная сущность по идентификатору
	 *
	 * @throws EntityNotFoundException - Если сущность не модифицирована
	 */
	public async modifyOneById({
		meta,
		id,
		update,
		options
	}: {
		meta: ServiceMeta;
		id: TModel['_id'];
		update: UpdateFilterMongo<TModel> | Partial<TModel>;
		options?: ModifyOneOptions<TModel>;
	}): Promise<ServiceResponse<WithId<TModel>>> {
		/** Преобразуем опции обновления сущности в опции репозитория. */
		const repoOpts = this.toRepoModifyOpts(options, meta);
		const modifyRes = await this.repo.modifyOneById(id, update, repoOpts);

		// Если операция модификации не была подтверждена, то выбрасываем исключение.
		if (modifyRes.ok === 0) {
			const err = new RepositoryWriteException({
				message: `Modify not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { id }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not modified`,
				details: { id, options },
				error: err
			});
			throw err;
		}

		// Если сущность не модифицирована, то выбрасываем исключение.
		if (modifyRes.value === null) {
			const err = new EntityNotFoundException({
				message: `No ${this.repo.getEntityName()} matched for modify`,
				origin: this.origin,
				details: { id, options }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not modified`,
				details: { id, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем модифицированную сущность в ответе. */
		return ServiceResponse.updated(modifyRes.value);
	}

	/**
	 * @description
	 * Метод для модификации сущности по фильтру.
	 *
	 * @param {Object} params - Параметры модификации сущности по фильтру
	 * @param {ServiceMeta} params.meta - Метаданные сервиса
	 * @param {FilterMongo<TModel>} params.filter - Фильтр сущности
	 * @param {UpdateFilterMongo<TModel> | Partial<TModel>} params.update - Обновление сущности
	 * @param {ModifyOneOptions<TModel>} params.options - Опции обновления сущности
	 *
	 * @returns Модифицированная сущность по фильтру
	 *
	 * @throws EntityNotFoundException - Если сущность не модифицирована
	 */
	public async modifyOneByFilter({
		meta,
		filter,
		update,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		update: UpdateFilterMongo<TModel> | Partial<TModel>;
		options?: ModifyOneOptions<TModel>;
	}): Promise<ServiceResponse<WithId<TModel>>> {
		/** Преобразуем опции обновления сущности в опции репозитория. */
		const repoOpts = this.toRepoModifyOpts(options, meta);
		const modifyRes = await this.repo.modifyOneByFilter(
			filter,
			update,
			repoOpts
		);

		// Если операция модификации не была подтверждена, то выбрасываем исключение.
		if (modifyRes.ok === 0) {
			const err = new RepositoryWriteException({
				message: `Modify not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { filter }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not modified`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		// Если сущность не модифицирована, то выбрасываем исключение.
		if (modifyRes.value === null) {
			const err = new EntityNotFoundException({
				message: `No ${this.repo.getEntityName()} matched for modify`,
				origin: this.origin,
				details: { filter, options }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not modified`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем модифицированную сущность в ответе. */
		return ServiceResponse.updated(modifyRes.value);
	}

	/**
	 * ? === === === DELETE === === ===
	 */

	/**
	 * @description
	 * Метод для преобразования опций удаления сущностей в опции репозитория.
	 *
	 * @param options - Опции удаления сущностей
	 * @param meta - Метаданные сервиса
	 *
	 * @returns Опции репозитория
	 */
	private toRepoDeleteOpts(
		options: DeleteOneOptions<TModel> | DeleteManyOptions<TModel> | undefined,
		meta: ServiceMeta
	) {
		return {
			...options,
			session: meta.session,
			comment: meta.requestId // критично: привязываем запрос ко всем операциям в логе Mongo
		};
	}

	/**
	 * @description
	 * Метод для удаления сущности по идентификатору.
	 *
	 * @param id - Идентификатор сущности
	 * @param options - Опции удаления
	 *
	 * @returns Количество удаленных сущностей (1) по идентификатору
	 *
	 * @throws EntityNotFoundException - Если сущность не удалена
	 */
	public async deleteOneById({
		meta,
		id,
		options
	}: {
		meta: ServiceMeta;
		id: TModel['_id'];
		options?: DeleteOneOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		/** Преобразуем опции удаления сущности в опции репозитория. */
		const repoOpts = this.toRepoDeleteOpts(options, meta);
		const deletedRes = await this.repo.deleteOneById(id, repoOpts);

		// Если операция удаления не была подтверждена, то выбрасываем исключение.
		if (deletedRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Delete not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { id }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { id, options },
				error: err
			});
			throw err;
		}

		// Если сущность не удалена, то выбрасываем исключение.
		if (deletedRes.deletedCount === 0) {
			const err = new EntityNotFoundException({
				message: `${this.repo.getEntityName()} not found`,
				origin: this.origin,
				details: { id }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { id, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество удаленных сущностей в ответе. */
		return ServiceResponse.deleted(deletedRes.deletedCount);
	}

	/**
	 * @description
	 * Метод для удаления сущности по фильтру.
	 *
	 * @param filter - Фильтр для поиска сущности
	 * @param options - Опции удаления
	 *
	 * @returns Количество удаленных сущностей по фильтру
	 *
	 * @throws EntityNotFoundException - Если сущность не удалена
	 */
	public async deleteOneByFilter({
		meta,
		filter,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		options?: DeleteOneOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		/** Преобразуем опции удаления сущности в опции репозитория. */
		const repoOpts = this.toRepoDeleteOpts(options, meta);
		const deletedRes = await this.repo.deleteOneByFilter(filter, repoOpts);

		// Если операция удаления не была подтверждена, то выбрасываем исключение.
		if (deletedRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Delete not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { filter }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		// Если сущность не удалена, то выбрасываем исключение.
		if (deletedRes.deletedCount === 0) {
			// Если сущность не удалена, то выбрасываем исключение.
			const err = new EntityNotFoundException({
				message: `${this.repo.getEntityName()} not found`,
				origin: this.origin,
				details: { filter }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество удаленных сущностей в ответе. */
		return ServiceResponse.deleted(deletedRes.deletedCount);
	}

	/**
	 * @description
	 * Метод для удаления сущностей по идентификаторам.
	 *
	 * @param ids - Идентификаторы сущностей
	 * @param options - Опции удаления
	 *
	 * @returns Количество удаленных сущностей по идентификаторам
	 *
	 * @throws EntityNotFoundException - Если сущность не удалена
	 */
	public async deleteManyByIds({
		meta,
		ids,
		options
	}: {
		meta: ServiceMeta;
		ids: TModel['_id'][];
		options?: DeleteManyOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		// Если список идентификаторов пуст, то возвращаем 0 удаленных сущностей.
		if (ids.length === 0) {
			return ServiceResponse.deleted(0);
		}
		/** Преобразуем опции удаления сущностей в опции репозитория. */
		const repoOpts = this.toRepoDeleteOpts(options, meta);
		const deletedRes = await this.repo.deleteManyByIds(ids, repoOpts);

		// Если операция удаления не была подтверждена, то выбрасываем исключение.
		if (deletedRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Delete not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { ids }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { ids, options },
				error: err
			});
			throw err;
		}

		// Если сущности не удалены, то выбрасываем исключение.
		if (deletedRes.deletedCount === 0) {
			const err = new EntityNotFoundException({
				message: `No ${this.repo.getEntityName()} matched for deletion`,
				origin: this.origin,
				details: { ids }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { ids, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество удаленных сущностей в ответе. */
		return ServiceResponse.deleted(deletedRes.deletedCount);
	}

	/**
	 * @description
	 * Метод для удаления сущностей по фильтру.
	 *
	 * @param filter - Фильтр для поиска сущностей
	 * @param options - Опции удаления
	 *
	 * @returns Количество удаленных сущностей по фильтру
	 *
	 * @throws EntityNotFoundException - Если сущность не удалена
	 */
	public async deleteManyByFilter({
		meta,
		filter,
		options
	}: {
		meta: ServiceMeta;
		filter: FilterMongo<TModel>;
		options?: DeleteManyOptions<TModel>;
	}): Promise<ServiceResponse<number>> {
		// Если не разрешено обрезать коллекцию, и передан пустой фильтр, то выбрасываем исключение.
		if (!options?.allowTruncate && Object.keys(filter).length === 0) {
			const err = new UnsafeOperationException({
				message: `Refused to delete all ${this.repo.getEntityName()} without allowTruncate`,
				origin: this.origin,
				details: { filter, options }
			});
			this.error({
				requestId: meta.requestId,
				message: `Refused to delete all ${this.repo.getEntityName()} without allowTruncate`,
				details: { filter, options },
				error: err
			});
			throw err;
		}
		/** Преобразуем опции удаления сущностей в опции репозитория. */
		const repoOpts = this.toRepoDeleteOpts(options, meta);
		const deletedRes = await this.repo.deleteManyByFilter(filter, repoOpts);

		// Если операция удаления не была подтверждена, то выбрасываем исключение.
		if (deletedRes.acknowledged === false) {
			const err = new RepositoryWriteException({
				message: `Delete not acknowledged for ${this.repo.getEntityName()}`,
				origin: this.origin,
				details: { filter }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		// Если сущности не удалены, то выбрасываем исключение.
		if (deletedRes.deletedCount === 0) {
			const err = new EntityNotFoundException({
				message: `No ${this.repo.getEntityName()} matched for deletion`,
				origin: this.origin,
				details: { filter, options }
			});
			this.error({
				requestId: meta.requestId,
				message: `${this.repo.getEntityName()} not deleted`,
				details: { filter, options },
				error: err
			});
			throw err;
		}

		/** Возвращаем количество удаленных сущностей в ответе. */
		return ServiceResponse.deleted(deletedRes.deletedCount);
	}
}
