/**
 * @file File.controller.ts
 * @module modules/file
 * @description
 * Контроллер обработки файловых запросов.
 *
 * @routes
 * - `GET /files/:id` - Получить файл по ID
 */

/**
 * ! my imports
 */
import { SuccessResponse } from '@core/http';
import { ObjectIdParamsRequest } from '@core/dto';
import { ControllerModule } from '@core/base';
import { FileService } from '@modules/file/File.service';
import { AppContextUnauthorized } from '@core/types/http/AppContext';

export class FileController extends ControllerModule {
	private service: FileService;

	constructor() {
		super(FileController.name);
		this.service = FileService.getInstance();

		this.getOneFileById = this.getOneFileById.bind(this);
		this.createFile = this.createFile.bind(this);
	}

	/** GET /file/:id */
	/**
	 * @description
	 * Получение файла по ID.
	 *
	 * @param id - ID файла
	 *
	 * @response 200 SuccessResponse - Успешное получение файла
	 */
	public async getOneFileById(
		ctx: AppContextUnauthorized<ObjectIdParamsRequest>
	) {
		const { id } = ctx.state.validated.params;
		const resp = await this.service.getOneFileById({
			requestId: ctx.requestId,
			id
		});

		const apiResponse = SuccessResponse.ok({
			message: 'File found successfully',
			details: {
				id: resp.getData()._id
			},
			data: resp.getData()
		});

		ctx.reply.fromApiResponse(apiResponse);
	}

	public async createFile(ctx: AppContextUnauthorized) {
		this.debug({
			message: 'createFile',
			details: { files: ctx.state.validated.files }
		});

		const apiResponse = SuccessResponse.ok({
			message: 'File created successfully',
			details: {},
			data: null
		});

		ctx.reply.fromApiResponse(apiResponse);
	}
}
