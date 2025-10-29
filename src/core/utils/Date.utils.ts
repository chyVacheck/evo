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
	public constructor() {
		super(DateUtils.name);
	}

	/**
	 * Добавляет ведущие нули к числу, если оно меньше заданной ширины.
	 *
	 * @param n Число, к которому нужно добавить ведущие нули
	 * @param size Ширина числа после добавления ведущих нулей (по умолчанию 2)
	 * @returns Строка с добавленными ведущими нулями
	 */
	protected pad(n: number, size = 2) {
		return n.toString().padStart(size, '0');
	}

	/**
	 * Возвращает время в формате 24-часового времени.
	 *
	 * @param date Объект Date, представляющий время.
	 * @returns Время в формате "HH:mm:ss.SSS" (24-часовой формат).
	 */
	public get24HourTime(date: Date): string {
		return `${this.pad(date.getHours())}:${this.pad(
			date.getMinutes()
		)}:${this.pad(date.getSeconds())}.${this.pad(date.getMilliseconds(), 3)}`;
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
		return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(
			date.getDate()
		)}` as StrictDateString;
	}
}

/**
 * Экземпляр DateUtils, который может быть использован для вызова методов утилит.
 */
const util = new DateUtils();

/**
 * Экспортируем единственный экземпляр DateUtils
 */
export { util as DateUtils };
