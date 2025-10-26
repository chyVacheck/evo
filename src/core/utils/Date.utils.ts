/**
 * @file Date.utils.ts
 * @module core/utils
 *
 * @description
 * Класс для работы со временем.
 *
 * @extends BaseUtil
 *
 * @see BaseUtil
 */

/**
 * ! my imports
 */
import { BaseUtil } from '@core/base';
import { StrictDateString } from '@core/types';

/**
 * Утилиты для работы с датами.
 */
class DateUtils extends BaseUtil {
	static instance: DateUtils = new DateUtils();

	private constructor() {
		super(DateUtils.name);
	}

	/**
	 * Получить текущий экземпляр DateUtils.
	 *
	 * Метод позволяет безопасно получить и использовать ранее инициализированный
	 * экземпляр модуля.
	 *
	 * @return {DateUtils}
	 */
	public static getInstance(): DateUtils {
		return DateUtils.instance;
	}

	public get24HourTime(date: Date): string {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

		return `${hours}:${minutes}:${seconds}.${milliseconds}`;
	}

	/**
	 * Утилитная функция для возврата текущую даты в формате StrictDateString
	 *
	 * @param date объект Date
	 * @returns строка формата "YYYY-MM-DD" с брендом StrictDateString
	 */
	public getCurrentStrictDateString(): StrictDateString {
		return this.toStrictDateString(new Date());
	}

	/**
	 * Утилитная функция для генерации StrictDateString из объекта Date
	 *
	 * @param date объект Date
	 * @returns строка формата "YYYY-MM-DD" с брендом StrictDateString
	 */
	public toStrictDateString(date: Date): StrictDateString {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}` as StrictDateString;
	}
}

const util = DateUtils.getInstance();

/**
 * Экспортируем единственный экземпляр DateUtils
 */
export { util as DateUtils };
