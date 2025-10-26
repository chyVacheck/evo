/**
 * @file LogOptions.ts
 * @module core/types/logger
 */

/**
 * @description
 * Опции для настройки логирования.
 */
export interface LogOptions {
	/**
	 * Сохранять лог в файл (по умолчанию берётся из LOGGER_CONFIG.file.enabled)
	 * @default LOGGER_CONFIG.file.enabled
	 */
	save?: boolean;
	/**
	 * Проверять ли путь к директории на существование, каждый раз при логировании.
	 * @default LOGGER_CONFIG.file.checkPath
	 */
	checkPath?: boolean;
}
