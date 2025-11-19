/**
 * @file Mongo.model.ts
 * @module core/types/model
 *
 * @description
 * Базовая модель для MongoDB
 *
 * @interface MongoModel
 *
 * @param TId - Тип идентификатора документа в MongoDB.
 */

/**
 * ! lib imports
 */
import { Document } from 'mongodb';

/**
 * ! my imports
 */
import { TId } from '@core/types/repository/Mongo';

export interface MongoModel<T extends TId = TId> extends Document {
	_id?: T;
}
