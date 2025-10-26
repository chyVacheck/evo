/**
 * @file logger.config.ts
 * @module config
 */

/**
 * @description
 * Конфигурация логгера.
 *
 * @property {boolean} FILE.ENABLE - Включение логирования в файл.
 * @property {boolean} FILE.CHECK_PATH - Проверять ли путь к директории на существование, каждый раз при логировании.
 * @property {number} FILE.MAX_LOG_SIZE - Максимальный размер файла логов (в байтах).
 * @property {string} FILE.PATH - Путь к директории для хранения логов.
 * @property {number} MAX_LEVEL_WIDTH - Максимальная ширина поля уровня логирования.
 * @property {number} MAX_CURRENT_TIME_WIDTH - Максимальная ширина поля текущего времени.
 * @property {number} MAX_MODULE_TYPE_WIDTH - Максимальная ширина поля типа модуля.
 * @property {number} MAX_MODULE_NAME_WIDTH - Максимальная ширина поля имени модуля.
 * @property {number} CONSOLE.PRETTY_DETAILS - Включение красивого вывода деталей в консоль.
 * @property {number} CONSOLE.DETAILS_INDENT - Отступ для вложенных деталей в красивом выводе.
 * @property {number} CONSOLE.MAX_DETAILS_LENGTH - Максимальная длина выводимой строки деталей.
 * @property {boolean} CONSOLE.SHOW_REQUEST_ID - Показывать ли идентификатор запроса в консольном выводе.
 * @property {boolean} CONSOLE.SHOW_ERROR_STACK - Показывать ли стек ошибки в консольном выводе.
 * @property {boolean} CONSOLE.COLORIZE - Включение цветного вывода в консоль.
 */
export const LOGGER_CONFIG = {
	/** Конфигурация логирования в файл. */
	FILE: {
		/** Включение логирования в файл. */
		ENABLE: true,
		/** Проверять ли путь к директории на существование, каждый раз при логировании. */
		CHECK_PATH: false,
		/** Максимальный размер файла логов (в байтах). */
		MAX_LOG_SIZE: 5 * 1024 * 1024, // 5MB
		/** Путь к директории для хранения логов. */
		PATH: './logs/'
	},
	/** Максимальная ширина поля уровня логирования. */
	MAX_LEVEL_WIDTH: 5,
	/** Максимальная ширина поля текущего времени. */
	MAX_CURRENT_TIME_WIDTH: 12,
	/** Максимальная ширина поля типа модуля. */
	MAX_MODULE_TYPE_WIDTH: 12,
	/** Максимальная ширина поля имени модуля. */
	MAX_MODULE_NAME_WIDTH: 26,
	/** Конфигурация вывода логов в консоль. */
	CONSOLE: {
		/** Включение красивого вывода деталей в консоль. */
		PRETTY_DETAILS: false,
		/** Отступ для вложенных деталей в красивом выводе. */
		DETAILS_INDENT: 2,
		/** Максимальная длина выводимой строки деталей. */
		MAX_DETAILS_LENGTH: 4000,
		/** Показывать ли идентификатор запроса в консольном выводе. */
		SHOW_REQUEST_ID: true,
		/** Показывать ли стек ошибки в консольном выводе. */
		SHOW_ERROR_STACK: true,
		/** Включение цветного вывода в консоль. */
		COLORIZE: true
	}
};
