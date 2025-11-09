/**
 * @file String.utils.ts
 * @module core/utils
 *
 * @description
 * Утилитарный класс для работы со строками.
 *
 * @extends UtilModule
 *
 * @see UtilModule
 */

/**
 * ! my imports
 */
import { UtilModule } from '@core/base';

/**
 * Утилиты для работы со строками.
 */
class StringUtils extends UtilModule {
	public constructor() {
		super(StringUtils.name);
	}

	/**
	 * Добавляет пробелы в конец строки до заданной ширины.
	 *
	 * @param str Строка, к которой нужно добавить пробелы
	 * @param width Ширина строки после добавления пробелов
	 * @returns Строка с добавленными пробелами
	 */
	public padString(str: string, width: number): string {
		return str.padEnd(width);
	}

	/**
	 * Возвращает последний символ строки.
	 *
	 * @param string Строка, из которой нужно получить последний символ
	 * @returns Последний символ строки
	 */
	public getLastChar(string: string): string {
		return string.charAt(string.length - 1);
	}

	public getFirstChar(string: string): string {
		return string.charAt(0);
	}
}

/**
 * Экземпляр StringUtils, который может быть использован для вызова методов утилит.
 */
const util = new StringUtils();

/**
 * Экспортируем единственный экземпляр StringUtils
 */
export { util as StringUtils };
