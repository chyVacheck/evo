/**
 * @file Repository.module.ts
 * @module core/base
 *
 * @description
 * Базовый абстрактный класс для всех репозиторий модулей приложения.
 *
 * @see EModuleType
 *
 * @example
 * ```ts
 * class UserRepository extends RepositoryModule {
 *   constructor() {
 *     super(UserRepository.name);
 *   }
 * }
 * ```
 */

/**
 * ! my imports
 */
import { EModuleType } from '@core/types';
import { BaseModule } from '@core/base/Base.module';

/**
 * Абстрактный класс репозитория.
 *
 * @typeParam ModuleName - Имя модуля (литеральная строка).
 */
export abstract class RepositoryModule extends BaseModule {
	/** Имя группы сущностей (для логов/ошибок) */
	protected readonly entitiesGroup: string;
	/** Имя сущности (для логов/ошибок) */
	protected readonly entityName: string;

	/**
	 * Базовый конструктор Repository-модуля.
	 * @param moduleName - Название модуля
	 */
	constructor(moduleName: string, entitiesGroup: string, entityName: string) {
		super(EModuleType.REPOSITORY, moduleName);
		this.entitiesGroup = entitiesGroup;
		this.entityName = entityName;
	}

	/**
	 * ? === === === Public === === ===
	 */

	/**
	 * Метод получения имени группы сущностей, к которой относится репозиторий.
	 *
	 * @returns Имя таблицы/коллекции/группы сущностей (литеральная строка).
	 */
	public getEntitiesGroup(): string {
		return this.entitiesGroup;
	}

	/**
	 * Абстрактный метод получения имени сущности, к которой относится репозиторий.
	 *
	 * @returns Имя сущности (литеральная строка).
	 */
	public getEntityName(): string {
		return this.entityName;
	}
}

// {
// 	/**
// 	 * ? === === === Create === === ===
// 	 */

// 	/**
// 	 * Создать одну сущность.
// 	 *
// 	 * @param data - Данные создаваемой сущности.
// 	 * @param opts - Общие опции вызова.
// 	 * @returns Созданная сущность (с заполненными полями/id).
// 	 */
// 	abstract createOne(data: TModel, opts?: TRepoCommonOpts): Promise<TModel>;

// 	/**
// 	 * Создать множество сущностей.
// 	 *
// 	 * @param list - Список данных для создания.
// 	 * @param opts - Общие опции вызова.
// 	 * @returns Массив созданных сущностей (в исходном порядке).
// 	 */
// 	abstract createMany(
// 		list: TModel[],
// 		opts?: TRepoCommonOpts
// 	): Promise<TModel[]>;

// 	/**
// 	 * Получить одну сущность по её идентификатору.
// 	 *
// 	 * @param id - Идентификатор сущности.
// 	 * @param opts - Общие опции вызова (контекст, драйверные опции и пр.).
// 	 * @returns Сущность или `null`, если не найдена.
// 	 */
// 	abstract findOneById(id: TId, opts?: TRepoCommonOpts): Promise<TModel | null>;

// 	/**
// 	 * Получить множество сущностей по списку идентификаторов.
// 	 *
// 	 * @param ids - Список идентификаторов.
// 	 * @param opts - Общие опции вызова.
// 	 * @returns Массив сущностей (порядок не гарантируется).
// 	 */
// 	abstract findManyByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<TModel[]>;

// 	/**
// 	 * Найти одну сущность по фильтру.
// 	 *
// 	 * @param filter - Критерий поиска.
// 	 * @param opts - Общие опции + опции выборки (`limit/skip/sort/projection`).
// 	 * @returns Сущность или `null`, если не найдена.
// 	 */
// 	abstract findOneByFilter(
// 		filter: TFilter,
// 		opts?: TRepoCommonOpts & { options?: TQueryOptions<TModel> }
// 	): Promise<TModel | null>;

// 	/**
// 	 * Найти множество сущностей по фильтру.
// 	 *
// 	 * @param params.filter - Критерий поиска.
// 	 * @param params.options - Опции выборки (`limit/skip/sort/projection`).
// 	 * @param params.ctx - Контекст запроса.
// 	 * @param params.driver - Драйвер-специфичные опции.
// 	 * @returns Массив найденных сущностей.
// 	 */
// 	abstract findManyByFilter(
// 		params?: {
// 			filter?: TFilter;
// 			options?: TQueryOptions<TModel>;
// 		} & TRepoCommonOpts
// 	): Promise<TModel[]>;

// 	/**
// 	 * Постраничная выборка сущностей.
// 	 *
// 	 * @param params.filter - Критерий поиска.
// 	 * @param params.options - Опции выборки.
// 	 * @param params.page - Номер страницы (>= 1).
// 	 * @param params.pageSize - Размер страницы (> 0).
// 	 * @returns Объект с элементами, total и параметрами пагинации.
// 	 */
// 	abstract paginate(
// 		params: {
// 			filter?: TFilter;
// 			options?: TQueryOptions<TModel>;
// 			page: number;
// 			pageSize: number;
// 		} & TRepoCommonOpts
// 	): Promise<TPagedResult<TModel>>;

// 	/**
// 	 * Подсчитать количество сущностей, удовлетворяющих фильтру.
// 	 */
// 	abstract count(filter?: TFilter, opts?: TRepoCommonOpts): Promise<number>;

// 	/**
// 	 * Подсчитать количество сущностей по списку идентификаторов.
// 	 *
// 	 * @param ids - Список идентификаторов.
// 	 * @param opts - Общие опции вызова.
// 	 */
// 	abstract countByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<number>;

// 	/**
// 	 * Проверить существование хотя бы одной сущности по фильтру.
// 	 */
// 	abstract exists(filter: TFilter, opts?: TRepoCommonOpts): Promise<boolean>;

// 	/**
// 	 * Проверить существование сущности по идентификатору.
// 	 */
// 	abstract existsById(id: TId, opts?: TRepoCommonOpts): Promise<boolean>;

// 	/**
// 	 * Проверить существование хотя бы одной сущности из списка идентификаторов.
// 	 */
// 	abstract existsByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<boolean>;

// 	/**
// 	 * Получить уникальные значения поля среди сущностей, удовлетворяющих фильтру.
// 	 */
// 	abstract distinct<K extends keyof TModel = keyof TModel>(
// 		field: K,
// 		filter?: TFilter,
// 		opts?: TRepoCommonOpts
// 	): Promise<Array<NonNullable<TModel[K]>>>;

// 	/**
// 	 * ? === === === Update === === ===
// 	 */

// 	/**
// 	 * Обновить одну сущность по идентификатору.
// 	 *
// 	 * @returns Количество затронутых записей (0 или 1).
// 	 */
// 	abstract updateOneById(
// 		id: TId,
// 		update: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Обновить множество сущностей по списку идентификаторов.
// 	 *
// 	 * @param ids - Список идентификаторов.
// 	 * @param update - Данные/операторы обновления.
// 	 * @returns Количество затронутых записей.
// 	 */
// 	abstract updateManyByIds(
// 		ids: TIds,
// 		update: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Обновить одну сущность по фильтру (первую подходящую).
// 	 *
// 	 * @param filter - Критерий выбора.
// 	 * @returns Количество затронутых записей (0 или 1).
// 	 */
// 	abstract updateOneByFilter(
// 		filter: TFilter,
// 		update: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Обновить множество сущностей по фильтру.
// 	 */
// 	abstract updateManyByFilter(
// 		filter: TFilter,
// 		update: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Создать или обновить сущность по фильтру (upsert).
// 	 *
// 	 * @returns Флаг `created` и количество затронутых записей.
// 	 */
// 	abstract upsert(
// 		filter: TFilter,
// 		createData: TModel,
// 		updateData?: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<{ created: boolean; affected: number }>;

// 	/**
// 	 * Создать или обновить сущность по идентификатору (upsert).
// 	 *
// 	 * @param id - Идентификатор целевой сущности.
// 	 * @param createData - Данные для создания, если сущность не существует.
// 	 * @param updateData - Данные/операторы обновления, если сущность существует.
// 	 */
// 	abstract upsertOneById(
// 		id: TId,
// 		createData: TModel,
// 		updateData?: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<{ created: boolean; affected: number }>;

// 	/**
// 	 * Создать или обновить множество сущностей по списку идентификаторов (upsert).
// 	 *
// 	 * @param ids - Список идентификаторов.
// 	 * @param createDataFactory - Фабрика данных для создания на основе id (если сущности нет).
// 	 * @param updateData - Данные/операторы обновления для существующих сущностей.
// 	 */
// 	abstract upsertManyByIds(
// 		ids: TIds,
// 		createDataFactory: (id: TId) => TModel,
// 		updateData?: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<{ created: number; affected: number }>;

// 	/**
// 	 * Создать или обновить множество сущностей по фильтру (upsert).
// 	 *
// 	 * @param filter - Критерий выбора множества.
// 	 * @param createData - Данные для создания, если ничего не найдено (реализация-зависимо).
// 	 * @param updateData - Данные/операторы обновления для найденных.
// 	 */
// 	abstract upsertManyByFilter(
// 		filter: TFilter,
// 		createData: TModel | TModel[],
// 		updateData?: TUpdate,
// 		opts?: TRepoCommonOpts
// 	): Promise<{ created: number; affected: number }>;

// 	/**
// 	 * ? === === === Delete / Restore === === ===
// 	 */

// 	/**
// 	 * Удалить сущность по идентификатору.
// 	 *
// 	 * @param params.soft - Использовать soft-delete, если поддерживается.
// 	 */
// 	abstract deleteById(
// 		id: TId,
// 		params?: { soft?: boolean } & TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Удалить множество сущностей по списку идентификаторов.
// 	 *
// 	 * @param ids - Список идентификаторов.
// 	 * @param params.soft - Использовать soft-delete, если поддерживается.
// 	 */
// 	abstract deleteManyByIds(
// 		ids: TIds,
// 		params?: { soft?: boolean } & TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Удалить одну сущность по фильтру (первую подходящую).
// 	 */
// 	abstract deleteOneByFilter(
// 		filter: TFilter,
// 		params?: { soft?: boolean } & TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Удалить множество сущностей по фильтру.
// 	 */
// 	abstract deleteManyByFilter(
// 		filter: TFilter,
// 		params?: { soft?: boolean } & TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Восстановить одну сущность по идентификатору (для soft-delete).
// 	 */
// 	abstract restoreById(id: TId, opts?: TRepoCommonOpts): Promise<number>;

// 	/**
// 	 * Восстановить множество сущностей по списку идентификаторов (для soft-delete).
// 	 */
// 	abstract restoreManyByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<number>;

// 	/**
// 	 * Восстановить одну сущность по фильтру (для soft-delete, первую подходящую).
// 	 */
// 	abstract restoreOneByFilter(
// 		filter: TFilter,
// 		opts?: TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * Восстановить множество сущностей по фильтру (для soft-delete).
// 	 */
// 	abstract restoreManyByFilter(
// 		filter: TFilter,
// 		opts?: TRepoCommonOpts
// 	): Promise<number>;

// 	/**
// 	 * ? === === === Bulk / Aggregate / Tx === === ===
// 	 */

// 	/**
// 	 * Выполнить пакет операций.
// 	 * Конкретная реализация определяет формат операций (например, bulkWrite в Mongo).
// 	 *
// 	 * @param operations - Список операций в формате целевой БД.
// 	 * @param opts - Общие опции вызова.
// 	 * @returns Результат драйвера (тип зависит от реализации).
// 	 */
// 	abstract bulk(
// 		operations: unknown[],
// 		opts?: TRepoCommonOpts
// 	): Promise<unknown>;

// 	/**
// 	 * Выполнить агрегирующий конвейер/запрос.
// 	 * Формат `pipeline` задаётся реализацией (например, Mongo aggregation pipeline).
// 	 *
// 	 * @typeParam TRow - Тип строки результата/выходных документов.
// 	 * @param pipeline - Конвейер/описание агрегирования.
// 	 * @param opts - Общие опции вызова.
// 	 * @returns Массив результатов агрегирования.
// 	 */
// 	abstract aggregate(
// 		pipeline: unknown,
// 		opts?: TRepoCommonOpts
// 	): Promise<unknown[]>;

// 	/**
// 	 * Выполнить набор операций в транзакции (если поддерживается БД).
// 	 *
// 	 * @typeParam R - Тип возвращаемого значения из транзакционного callback.
// 	 * @param fn - Колбэк с операциями, выполняемыми в транзакции.
// 	 * @param opts - Общие опции вызова (драйвер-специфичные параметры транзакции).
// 	 * @returns Результат выполнения колбэка.
// 	 */
// 	abstract transaction<R>(
// 		fn: (trx: unknown) => Promise<R>,
// 		opts?: TRepoCommonOpts
// 	): Promise<R>;
// }
