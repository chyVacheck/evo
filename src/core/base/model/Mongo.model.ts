/**
 * @file Mongo.model.ts
 * @module core/base/model
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
import { TId } from '@core/types';

export interface MongoModel<T extends TId = TId> extends Document {
	_id?: T;
}
