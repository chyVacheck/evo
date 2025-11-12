/**
 * @file User.service.ts
 * @module modules/user
 */

/**
 * ! lib imports
 */
import { ObjectId } from 'mongodb';

/**
 * ! my imports
 */
import { MongoServiceModule } from '@core/base';
import { InitializationError } from '@core/errors';
import { FileRepository } from '@modules/file/File.repository';
import { FileModel } from '@modules/file/File.model';

export class FileService extends MongoServiceModule<FileModel> {
	private static instance: FileService;

	public static init(repo: FileRepository) {
		if (!FileService.instance) {
			FileService.instance = new FileService(repo);
		}
	}

	public static getInstance(): FileService {
		if (!FileService.instance) {
			throw new InitializationError({
				message: 'FileService not initialized',
				origin: FileService.name
			});
		}

		return FileService.instance;
	}

	constructor(repository: FileRepository) {
		super(FileService.name, repository);
	}

	public async getOneFileById({
		requestId,
		id
	}: {
		requestId: string;
		id: FileModel['_id'] | string;
	}) {
		if (typeof id === 'string') {
			id = new ObjectId(id);
		}

		return await this.getOneById({
			id: id,
			meta: { requestId: requestId }
		});
	}
}
