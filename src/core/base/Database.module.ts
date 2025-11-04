/**
 * @file Database.module.ts
 * @module core/base
 *
 * @extends BaseModule
 */

/**
 * ! my imports
 */
import { BaseModule } from '@core/base/Base.module';
import { EModuleType, EColor } from '@core/types';

/**
 * Class representing a database module.
 * @abstract
 * @extends BaseModule
 */
export abstract class BaseDatabase<
	ModuleName extends string
> extends BaseModule<ModuleName> {
	/** URL для подключения к базе данных */
	protected readonly url: string;
	/** Название базы данных */
	protected readonly title: string;

	constructor(moduleName: ModuleName, title: string, url: string) {
		super(EModuleType.DATABASE, moduleName);
		this.url = url;
		this.title = title;
	}

	protected getColorDatabaseName(endColor: EColor = EColor.GREEN): string {
		return `${EColor.CYAN}${this.title}${endColor}`;
	}

	/**
	 * Подключение к базе данных
	 */
	public abstract connect(): Promise<unknown>;

	/**
	 * Отключение от базы данных
	 */
	public abstract disconnect(): Promise<void>;
}
