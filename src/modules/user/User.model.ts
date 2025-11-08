/**
 * @file User.controller.ts
 * @module modules/user
 */

/**
 * ! lib imports
 */
import { type ObjectId } from 'mongodb';

/**
 * ! my imports
 */
import { MongoModel } from '@core/base';

export interface UserModel extends MongoModel<ObjectId> {
	data: {
		/**
		 * @description
		 * Имя пользователя
		 */
		name: string;
		/**
		 * @description
		 * Пароль пользователя
		 */
		email: string;
	};

	system: {
		/**
		 * @description
		 * Дата создания пользователя
		 */
		createdAt: Date;
		/**
		 * @description
		 * Дата последнего обновления пользователя
		 */
		updatedAt: Date;
	};
}
