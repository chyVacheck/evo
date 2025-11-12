/**
 * @file File.router.ts
 * @module modules/file
 * @description
 * Маршрутизация файловых запросов.
 *
 * @routes
 * - `GET /files/:id` - Получить файл по ID
 */

/**
 * ! my imports
 */
import { RouterModule } from '@core/base';
import { AppContextUnauthorized } from '@core/types';
import {
	ValidateParamsMiddleware,
	ValidateFilesMiddleware
} from '@core/middleware';
import { ObjectIdParamsSchema } from '@core/dto';
import { FileController } from '@modules/file/File.controller';

export class FileRouter extends RouterModule<AppContextUnauthorized> {
	private readonly controller = new FileController();

	constructor() {
		super(FileRouter.name, '/files');

		this.get('/:id', this.controller.getOneFileById)
			.useBefore(new ValidateParamsMiddleware(ObjectIdParamsSchema))
			.done();

		this.post('/', this.controller.createFile)
			.useBefore(new ValidateFilesMiddleware())
			.done();
	}
}
