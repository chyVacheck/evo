/**
 * @file File.model.ts
 * @module modules/file
 */

/**
 * ! lib imports
 */
import { type ObjectId } from 'mongodb';

/**
 * ! my imports
 */
import { MongoModel } from '@core/base';

export interface FileModel extends MongoModel<ObjectId> {
	data: {
		/**
		 * @description
		 * Оригинальное название файла
		 */
		name: string;
		/**
		 * @description
		 * Расширение файла
		 */
		extension: string;
		/**
		 * @description
		 * Путь к файлу
		 */
		path: string;
	};

	system: {
		/**
		 * @description
		 * Дата создания файла
		 */
		createdAt: Date;
		/**
		 * @description
		 * Дата удаления файла
		 */
		deletedAt: Date;
	};
}
