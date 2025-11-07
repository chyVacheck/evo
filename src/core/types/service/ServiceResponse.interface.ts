/**
 * @file ServiceProcessType.ts
 * @module core/types/service
 *
 * @description
 * Перечисление возможных типов процессов, выполняемых сервисами.
 * Используется для описания результата обработки запроса в слое сервиса.
 */

/**
 * Перечисление типов процессов выполнения сервисов.
 */
export enum ServiceProcessType {
	/** Ресурс успешно создан */
	CREATED = 'Created',
	/** Ресурс успешно найден */
	FOUNDED = 'Founded',
	/** Ресурс успешно обновлён */
	UPDATED = 'Updated',
	/** Ресурс успешно посчитан */
	COUNTED = 'Counted',
	/** Ресурс успешно восстановлен из удаленных */
	RESTORED = 'Restored',
	/** Ресурс успешно удалён */
	DELETED = 'Deleted',

	/** Ничего не изменено */
	NOTHING = 'Nothing'
}
