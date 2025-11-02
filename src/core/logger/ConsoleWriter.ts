/**
 * @file ConsoleWriter.ts
 * @module core/logger
 *
 * @description
 * Класс `ConsoleWriter` предназначен для форматирования и вывода логов в консоль.
 * Он применяется в логгере (`Logger`) как отдельный компонент, отвечающий
 * только за визуализацию логов в терминале.
 *
 * Основные задачи:
 * - Форматирование лог-сообщений по шаблону
 * - Добавление цвета в зависимости от уровня лога
 * - Отображение requestId и дополнительных деталей
 * - Выравнивание по заданной ширине (определено в LOGGER_CONFIG)
 *
 * @extends CoreModule
 *
 * @see CoreModule
 *
 * @author Dmytro Shakh
 */

/**
 * ! lib imports
 */
import { LOGGER_CONFIG } from '@config';
import { CoreModule } from '@core/base/Core.module';
import { EColor, ELogLevel, EModuleType, ILog } from '@core/types';
import { ConsolePrintOptions } from '@core/types/logger';
import { DateUtils, StringUtils } from '@core/utils';

/**
 * Класс `ConsoleWriter` отвечает за консольный вывод логов с форматированием и цветами.
 * Не занимается сохранением, сжатием или фильтрацией логов.
 */
export class ConsoleWriter extends CoreModule {
	private static INSTANCE: ConsoleWriter;

	/**
	 * Цветовая карта для уровней логирования
	 */
	private static readonly colors: Record<ELogLevel, EColor> = {
		[ELogLevel.DEBUG]: EColor.PURPLE,
		[ELogLevel.FATAL]: EColor.RED,
		[ELogLevel.ERROR]: EColor.RED,
		[ELogLevel.WARN]: EColor.YELLOW,
		[ELogLevel.INFO]: EColor.GREEN
	};

	/**
	 * Получить текущий экземпляр ConsoleWriter.
	 *
	 * Метод позволяет безопасно получить и использовать ранее инициализированный
	 * экземпляр модуля.
	 *
	 * @return {ConsoleWriter}
	 */
	public static getInstance(): ConsoleWriter {
		if (!this.INSTANCE) this.INSTANCE = new ConsoleWriter();

		return ConsoleWriter.INSTANCE;
	}

	/**
	 * Приватный конструктор класса `ConsoleWriter`.
	 *
	 * Инициализирует модуль `SYSTEM` с именем `ConsoleWriter`.
	 *
	 * @private
	 */
	private constructor() {
		super(EModuleType.SYSTEM, ConsoleWriter.name);
	}

	/**
	 * Основной метод класса — выводит отформатированный лог в консоль.
	 *
	 * @param log Объект лога с информацией о сообщении, уровне, модуле, времени и т.п.
	 */
	public print(log: ILog, opts?: ConsolePrintOptions): void {
		const {
			level,
			createdAt,
			moduleType,
			moduleName,
			message,
			requestId,
			details,
			error
		} = log;

		const options: Required<ConsolePrintOptions> = {
			prettyDetails: LOGGER_CONFIG.CONSOLE.PRETTY_DETAILS,
			detailsIndent: LOGGER_CONFIG.CONSOLE.DETAILS_INDENT,
			maxDetailsLength: LOGGER_CONFIG.CONSOLE.MAX_DETAILS_LENGTH,
			showRequestId: LOGGER_CONFIG.CONSOLE.SHOW_REQUEST_ID,
			showErrorStack: LOGGER_CONFIG.CONSOLE.SHOW_ERROR_STACK,
			colorize: LOGGER_CONFIG.CONSOLE.COLORIZE,
			...opts
		};

		const color = options.colorize ? ConsoleWriter.colors[level] : EColor.WHITE;
		const reset = options.colorize ? EColor.WHITE : '';

		/**
		 * Форматирование каждого блока лога:
		 * - Уровень лога
		 * - Время
		 * - Тип модуля
		 * - Название модуля
		 */

		// Уровень
		const paddedLevel = `${
			options.colorize ? EColor.WHITE : ''
		}[${color}${StringUtils.padString(
			level,
			LOGGER_CONFIG.MAX_LEVEL_WIDTH
		)}${reset}]`;

		// Время
		const timeStr = DateUtils.get24HourTime(createdAt);
		const paddedTime = `${
			options.colorize ? EColor.GRAY : ''
		}${StringUtils.padString(
			timeStr,
			LOGGER_CONFIG.MAX_CURRENT_TIME_WIDTH
		)}${reset}`;

		// Тип модуля
		const paddedType = `${
			options.colorize ? EColor.CYAN : ''
		}${StringUtils.padString(
			moduleType,
			LOGGER_CONFIG.MAX_MODULE_TYPE_WIDTH
		)}${reset}`;

		// Название модуля
		const paddedName = `${
			options.colorize ? EColor.CYAN : ''
		}${StringUtils.padString(
			moduleName,
			LOGGER_CONFIG.MAX_MODULE_NAME_WIDTH
		)}${reset}`;

		let logMessage = `${paddedLevel} ${paddedTime} ${paddedType}: ${paddedName} ${color}${message}${reset}`;

		// requestId
		if (options.showRequestId && requestId) {
			logMessage += `\nRequestId: ${
				options.colorize ? EColor.GRAY : ''
			}${requestId}${reset}`;
		}

		// details
		if (details) {
			let detailsStr = options.prettyDetails
				? JSON.stringify(details, null, options.detailsIndent)
				: JSON.stringify(details);

			if (
				options.maxDetailsLength > 0 &&
				detailsStr.length > options.maxDetailsLength
			) {
				detailsStr = detailsStr.slice(0, options.maxDetailsLength) + '…';
			}

			logMessage += `\nDetails: ${
				options.colorize ? EColor.GRAY : ''
			}${detailsStr}${reset}`;
		}

		// error
		if (error) {
			const errorMsg =
				error instanceof Error
					? options.showErrorStack
						? error.stack ?? error.message
						: error.message
					: String(error);
			logMessage += `\nError: ${
				options.colorize ? EColor.RED : ''
			}${errorMsg}${reset}`;
		}

		console.log(logMessage);
	}
}
