/**
 * @file LogCompressor.ts
 * @module core/logger
 *
 * @description
 * Утилита для сжатия логов. Преобразует подробный объект ILog
 * в компактный формат ILogCompressed для хранения или передачи.
 *
 * Используется в FileWriter и других хранилищах логов.
 *
 * @see ILog
 * @see ILogCompressed
 *
 * @author Dmytro Shakh
 */

/**
 * ! my imports
 */
import { CoreModule } from '@core/base';
import { EModuleType, ILog, ILogStored } from '@core/types';

export class LogCompressor extends CoreModule {
	private static INSTANCE: LogCompressor;

	private constructor() {
		super(EModuleType.SYSTEM, LogCompressor.name);
	}

	/**
	 * Получить текущий экземпляр LogCompressor.
	 *
	 * Метод позволяет безопасно получить и использовать ранее инициализированный
	 * экземпляр модуля.
	 *
	 * @return {LogCompressor}
	 */
	public static getInstance(): LogCompressor {
		if (!this.INSTANCE) this.INSTANCE = new LogCompressor();
		return LogCompressor.INSTANCE;
	}

	/**
	 * Сжимает объект полного лога в компактную структуру.
	 *
	 * @param log Подробный объект лога
	 * @returns Сжатый лог в формате ILogCompressed
	 */
	public compress(log: ILog): ILogStored {
		const base: ILogStored = {
			m: log.message,
			lvl: log.level,
			mt: log.moduleType,
			mn: log.moduleName,
			at: log.createdAt.getTime()
			// rid, d, e — добавим условно ниже
		};

		if (log.requestId) {
			base.rid = log.requestId;
		}

		const cleaned = this.cleanLogData(log.details);
		if (cleaned) {
			base.d = cleaned;
		}

		if (log.error) {
			if (log.error instanceof Error) {
				base.e = `${log.error.name}: ${log.error.message}`;
				// TODO: добавить
				// (ops?.console?.showErrorStack ?? true) && (base.d = { ...(base.d||{}), stack: log.error.stack });
			} else {
				base.e = String(log.error);
			}
		}

		return base;
	}

	/**
	 * Удаляет пустые объекты из поля `details` для экономии места.
	 *
	 * @param details Объект дополнительных данных
	 * @returns Очищенный объект без пустых вложенных объектов
	 */
	private cleanLogData(
		details?: Record<string, any>
	): Record<string, any> | undefined {
		if (!details || typeof details !== 'object') return undefined;
		const entries = Object.entries(details).filter(
			([, v]) =>
				!(
					v &&
					typeof v === 'object' &&
					!Array.isArray(v) &&
					Object.keys(v).length === 0
				)
		);
		if (entries.length === 0) return undefined;
		return Object.fromEntries(entries);
	}
}
