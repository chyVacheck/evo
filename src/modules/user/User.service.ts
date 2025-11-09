/**
 * @file User.service.ts
 * @module modules/user
 */

/**
 * ! lib imports
 */
import { ObjectId, WithId } from 'mongodb';

/**
 * ! my imports
 */
import { MongoServiceModule, ServiceResponse } from '@core/base';
import { InitializationError } from '@core/errors';
import { UserRepository } from '@modules/user/User.repository';
import { UserModel } from '@modules/user/User.model';
import { CreateUserRequest } from '@modules/user/request/CreateUser.request';

export class UserService extends MongoServiceModule<UserModel> {
	private static instance: UserService;

	public static init(repo: UserRepository) {
		if (!UserService.instance) {
			UserService.instance = new UserService(repo);
		}
	}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			throw new InitializationError({
				message: 'UserService not initialized',
				origin: UserService.name
			});
		}

		return UserService.instance;
	}

	constructor(repository: UserRepository) {
		super(UserService.name, repository);
	}

	public async getOneUserById({
		requestId,
		id
	}: {
		requestId: string;
		id: UserModel['_id'] | string;
	}) {
		if (typeof id === 'string') {
			id = new ObjectId(id);
		}

		return await this.getOneById({
			id: id,
			meta: { requestId: requestId }
		});
	}

	/** POST /user */
	public async createUser({
		requestId,
		body
	}: {
		requestId: string;
		body: CreateUserRequest;
	}): Promise<ServiceResponse<WithId<UserModel>>> {
		const data = {
			data: body,
			system: {
				createdAt: new Date(),
				updatedAt: new Date()
			}
		};

		return await this.createOne({
			data: data,
			meta: { requestId: requestId }
		});
	}
}
