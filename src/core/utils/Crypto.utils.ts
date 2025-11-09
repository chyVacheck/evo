/**
 * @file Crypto.utils.ts
 * @module core/utils
 *
 * @description
 * Утилитарный класс для работы с криптографическими функциями.
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
class CryptoUtils extends UtilModule {
	constructor() {
		super(CryptoUtils.name);
	}

	/**
	 * Генерирует случайный идентификатор строки заданной длины.
	 *
	 * @param slice Длина идентификатора (по умолчанию 8)
	 * @returns Случайный идентификатор строки
	 */
	public genRandomString(slice = 8): string {
		return crypto.randomUUID().slice(0, slice);
	}
}

const util = new CryptoUtils();

/**
 * Экспортируем единственный экземпляр CryptoUtils
 */
export { util as CryptoUtils };
