/**
 * @file String.utils.ts
 * @module core/utils
 *
 * @description
 * Утилитарный класс для работы со строками.
 *
 * @extends BaseUtil
 *
 * @see BaseUtil
 */

/**
 * ! my imports
 */
import { BaseUtil } from '@core/base';

/**
 * Утилиты для работы со строками.
 */
class StringUtils extends BaseUtil {
	static instance: StringUtils = new StringUtils();

	private constructor() {
		super(StringUtils.name);
	}

	/**
	 * Получить текущий экземпляр StringUtils.
	 *
	 * Метод позволяет безопасно получить и использовать ранее инициализированный
	 * экземпляр модуля.
	 *
	 * @return {StringUtils}
	 */
	public static getInstance(): StringUtils {
		return StringUtils.instance;
	}

	public padString(str: string, width: number): string {
		return str.padEnd(width);
	}

	public getLastChar(string: string): string {
		return string.charAt(string.length - 1);
	}

	public getFirstChar(string: string): string {
		return string.charAt(0);
	}
}

const util = StringUtils.getInstance();

/**
 * Экспортируем единственный экземпляр StringUtils
 */
export { util as StringUtils };
