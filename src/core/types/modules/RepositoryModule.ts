/**
 * @file RepositoryModule.ts
 * @module core/types/modules
 * @description
 * Интерфейс базового репозиторий-модуля ядра. Предоставляет
 * унифицированный контракт для операций чтения, записи,  обновления,
 * удаления, восстановления, пагинации, агрегирования, батчевых операций
 * и транзакций — симметрично для операций по id и по filter.
 *
 *
 * @extends IBaseModule
 *
 * @see EModuleType
 * @see IBaseModule
 *
 * @example
 * class SomeCustomRepository
 *   implements IRepositoryModule<'SomeRepository', User, UserFilter, UserUpdate> {
 *   // ...
 * }
 */

/**
 * ! my imports
 */
import { IBaseModule } from '@core/types/modules/BaseModule';
import { TId, TIds } from '@core/types/data/id';
import { TQueryOptions, TRepoCommonOpts } from '@core/types/repository';
import { TPagedResult } from '@core/types/data/pagination';

/**
 * Интерфейс базового репозиторий-модуля ядра.
 *
 * @typeParam ModuleName - Имя модуля для логирования/метрик (литеральная строка).
 * @typeParam TModel - Тип доменной сущности/документа, с которым работает репозиторий.
 * @typeParam TFilter - Тип фильтра для поиска (конкретная БД сузит, напр. `Filter<TModel>` в Mongo).
 * @typeParam TUpdate - Тип данных для обновления (по умолчанию `Partial<TModel>`).
 */
export interface IRepositoryModule<
	ModuleName extends string = string,
	TModel = any,
	TFilter = unknown, // конкретная БД сузит (например, Filter<TModel> в Mongo)
	TUpdate = Partial<TModel>
> extends IBaseModule<ModuleName> {
	/**
	 * ? === === === Create === === ===
	 */

	/**
	 * Создать одну сущность.
	 *
	 * @param data - Данные создаваемой сущности.
	 * @param opts - Общие опции вызова.
	 * @returns Созданная сущность (с заполненными полями/id).
	 */
	createOne(data: TModel, opts?: TRepoCommonOpts): Promise<TModel>;

	/**
	 * Создать множество сущностей.
	 *
	 * @param list - Список данных для создания.
	 * @param opts - Общие опции вызова.
	 * @returns Массив созданных сущностей (в исходном порядке).
	 */
	createMany(list: TModel[], opts?: TRepoCommonOpts): Promise<TModel[]>;

	/**
	 * ? === === === Read === === ===
	 */

	/**
	 * Получить одну сущность по её идентификатору.
	 *
	 * @param id - Идентификатор сущности.
	 * @param opts - Общие опции вызова (контекст, драйверные опции и пр.).
	 * @returns Сущность или `null`, если не найдена.
	 */
	findOneById(id: TId, opts?: TRepoCommonOpts): Promise<TModel | null>;

	/**
	 * Получить множество сущностей по списку идентификаторов.
	 *
	 * @param ids - Список идентификаторов.
	 * @param opts - Общие опции вызова.
	 * @returns Массив сущностей (порядок не гарантируется).
	 */
	findManyByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<TModel[]>;

	/**
	 * Найти одну сущность по фильтру.
	 *
	 * @param filter - Критерий поиска.
	 * @param opts - Общие опции + опции выборки (`limit/skip/sort/projection`).
	 * @returns Сущность или `null`, если не найдена.
	 */
	findOneByFilter(
		filter: TFilter,
		opts?: TRepoCommonOpts & { options?: TQueryOptions<TModel> }
	): Promise<TModel | null>;

	/**
	 * Найти множество сущностей по фильтру.
	 *
	 * @param params.filter - Критерий поиска.
	 * @param params.options - Опции выборки (`limit/skip/sort/projection`).
	 * @param params.ctx - Контекст запроса.
	 * @param params.driver - Драйвер-специфичные опции.
	 * @returns Массив найденных сущностей.
	 */
	findManyByFilter(
		params?: {
			filter?: TFilter;
			options?: TQueryOptions<TModel>;
		} & TRepoCommonOpts
	): Promise<TModel[]>;

	/**
	 * Получить одну сущность по её идентификатору.
	 *
	 * @param ids - Идентификаторы сущностей.
	 * @param opts - Общие опции вызова (контекст, драйверные опции и пр.).
	 * @returns Массив сущностей (может быть пустым, если ничего не найдено).
	 */
	findManyByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<TModel[]>;

	/**
	 * Найти множество сущностей по фильтру.
	 *
	 * @param params.filter - Критерий поиска.
	 * @param params.options - Опции выборки (`limit/skip/sort/projection`).
	 * @param params.ctx - Контекст запроса (requestId, userId).
	 * @param params.driver - Драйвер-специфичные опции (например, session/signal).
	 * @returns Массив найденных сущностей (пустой, если ничего нет).
	 */
	findManyByFilter(
		params?: {
			filter?: TFilter;
			options?: TQueryOptions<TModel>;
		} & TRepoCommonOpts
	): Promise<TModel[]>;

	/**
	 * Постраничная выборка сущностей.
	 *
	 * @param params.filter - Критерий поиска.
	 * @param params.options - Опции выборки.
	 * @param params.page - Номер страницы (>= 1).
	 * @param params.pageSize - Размер страницы (> 0).
	 * @returns Объект с элементами, total и параметрами пагинации.
	 */
	paginate(
		params: {
			filter?: TFilter;
			options?: TQueryOptions<TModel>;
			page: number;
			pageSize: number;
		} & TRepoCommonOpts
	): Promise<TPagedResult<TModel>>;

	/**
	 * Подсчитать количество сущностей, удовлетворяющих фильтру.
	 */
	count(filter?: TFilter, opts?: TRepoCommonOpts): Promise<number>;

	/**
	 * Подсчитать количество сущностей по списку идентификаторов.
	 *
	 * @param ids - Список идентификаторов.
	 * @param opts - Общие опции вызова.
	 */
	countByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<number>;

	/**
	 * Проверить существование хотя бы одной сущности по фильтру.
	 */
	exists(filter: TFilter, opts?: TRepoCommonOpts): Promise<boolean>;

	/**
	 * Проверить существование сущности по идентификатору.
	 */
	existsById(id: TId, opts?: TRepoCommonOpts): Promise<boolean>;

	/**
	 * Проверить существование хотя бы одной сущности из списка идентификаторов.
	 */
	existsByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<boolean>;

	/**
	 * Получить уникальные значения поля среди сущностей, удовлетворяющих фильтру.
	 */
	distinct<K extends keyof TModel = keyof TModel>(
		field: K,
		filter?: TFilter,
		opts?: TRepoCommonOpts
	): Promise<Array<NonNullable<TModel[K]>>>;

	/**
	 * ? === === === Update === === ===
	 */

	/**
	 * Обновить одну сущность по идентификатору.
	 *
	 * @returns Количество затронутых записей (0 или 1).
	 */
	updateOneById(
		id: TId,
		update: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<number>;

	/**
	 * Обновить множество сущностей по списку идентификаторов.
	 *
	 * @param ids - Список идентификаторов.
	 * @param update - Данные/операторы обновления.
	 * @returns Количество затронутых записей.
	 */
	updateManyByIds(
		ids: TIds,
		update: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<number>;

	/**
	 * Обновить одну сущность по фильтру (первую подходящую).
	 *
	 * @param filter - Критерий выбора.
	 * @returns Количество затронутых записей (0 или 1).
	 */
	updateOneByFilter(
		filter: TFilter,
		update: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<number>;

	/**
	 * Обновить множество сущностей по фильтру.
	 */
	updateManyByFilter(
		filter: TFilter,
		update: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<number>;

	/**
	 * Создать или обновить сущность по фильтру (upsert).
	 *
	 * @returns Флаг `created` и количество затронутых записей.
	 */
	upsert(
		filter: TFilter,
		createData: TModel,
		updateData?: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<{ created: boolean; affected: number }>;

	/**
	 * Создать или обновить сущность по идентификатору (upsert).
	 *
	 * @param id - Идентификатор целевой сущности.
	 * @param createData - Данные для создания, если сущность не существует.
	 * @param updateData - Данные/операторы обновления, если сущность существует.
	 */
	upsertOneById(
		id: TId,
		createData: TModel,
		updateData?: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<{ created: boolean; affected: number }>;

	/**
	 * Создать или обновить множество сущностей по списку идентификаторов (upsert).
	 *
	 * @param ids - Список идентификаторов.
	 * @param createDataFactory - Фабрика данных для создания на основе id (если сущности нет).
	 * @param updateData - Данные/операторы обновления для существующих сущностей.
	 */
	upsertManyByIds(
		ids: TIds,
		createDataFactory: (id: TId) => TModel,
		updateData?: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<{ created: number; affected: number }>;

	/**
	 * Создать или обновить множество сущностей по фильтру (upsert).
	 *
	 * @param filter - Критерий выбора множества.
	 * @param createData - Данные для создания, если ничего не найдено (реализация-зависимо).
	 * @param updateData - Данные/операторы обновления для найденных.
	 */
	upsertManyByFilter(
		filter: TFilter,
		createData: TModel | TModel[],
		updateData?: TUpdate,
		opts?: TRepoCommonOpts
	): Promise<{ created: number; affected: number }>;

	/**
	 * ? === === === Delete / Restore === === ===
	 */

	/**
	 * Удалить сущность по идентификатору.
	 *
	 * @param params.soft - Использовать soft-delete, если поддерживается.
	 */
	deleteById(
		id: TId,
		params?: { soft?: boolean } & TRepoCommonOpts
	): Promise<number>;

	/**
	 * Удалить множество сущностей по списку идентификаторов.
	 *
	 * @param ids - Список идентификаторов.
	 * @param params.soft - Использовать soft-delete, если поддерживается.
	 */
	deleteManyByIds(
		ids: TIds,
		params?: { soft?: boolean } & TRepoCommonOpts
	): Promise<number>;

	/**
	 * Удалить одну сущность по фильтру (первую подходящую).
	 */
	deleteOneByFilter(
		filter: TFilter,
		params?: { soft?: boolean } & TRepoCommonOpts
	): Promise<number>;

	/**
	 * Удалить множество сущностей по фильтру.
	 */
	deleteManyByFilter(
		filter: TFilter,
		params?: { soft?: boolean } & TRepoCommonOpts
	): Promise<number>;

	/**
	 * Восстановить одну сущность по идентификатору (для soft-delete).
	 */
	restoreById(id: TId, opts?: TRepoCommonOpts): Promise<number>;

	/**
	 * Восстановить множество сущностей по списку идентификаторов (для soft-delete).
	 */
	restoreManyByIds(ids: TIds, opts?: TRepoCommonOpts): Promise<number>;

	/**
	 * Восстановить одну сущность по фильтру (для soft-delete, первую подходящую).
	 */
	restoreOneByFilter(filter: TFilter, opts?: TRepoCommonOpts): Promise<number>;

	/**
	 * Восстановить множество сущностей по фильтру (для soft-delete).
	 */
	restoreManyByFilter(filter: TFilter, opts?: TRepoCommonOpts): Promise<number>;

	/**
	 * ? === === === Bulk / Aggregate / Tx === === ===
	 */

	/**
	 * Выполнить пакет операций.
	 * Конкретная реализация определяет формат операций (например, bulkWrite в Mongo).
	 *
	 * @param operations - Список операций в формате целевой БД.
	 * @param opts - Общие опции вызова.
	 * @returns Результат драйвера (тип зависит от реализации).
	 */
	bulk(operations: unknown[], opts?: TRepoCommonOpts): Promise<unknown>;

	/**
	 * Выполнить агрегирующий конвейер/запрос.
	 * Формат `pipeline` задаётся реализацией (например, Mongo aggregation pipeline).
	 *
	 * @typeParam TRow - Тип строки результата/выходных документов.
	 * @param pipeline - Конвейер/описание агрегирования.
	 * @param opts - Общие опции вызова.
	 * @returns Массив результатов агрегирования.
	 */
	aggregate<TRow = unknown>(
		pipeline: unknown,
		opts?: TRepoCommonOpts
	): Promise<TRow[]>;

	/**
	 * Выполнить набор операций в транзакции (если поддерживается БД).
	 *
	 * @typeParam R - Тип возвращаемого значения из транзакционного callback.
	 * @param fn - Колбэк с операциями, выполняемыми в транзакции.
	 * @param opts - Общие опции вызова (драйвер-специфичные параметры транзакции).
	 * @returns Результат выполнения колбэка.
	 */
	transaction<R>(
		fn: (trx: unknown) => Promise<R>,
		opts?: TRepoCommonOpts
	): Promise<R>;
}
