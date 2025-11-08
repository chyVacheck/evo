/**
 * @file User.controller.ts
 * @module modules/user
 * @description
 * Контроллер обработки пользовательских запросов.
 *
 * @routes
 * - `GET /users/:id` - Получить пользователя по ID
 * - `POST /users` - Создать нового пользователя
 */

/**
 * ! my imports
 */
import { ValidatedParamsState, ValidatedBodyState } from '@core/middleware';
import { HttpContext, PathParamsOf } from '@core/types/http';
import { HttpStatusCode, SuccessResponse } from '@core/http';
import { ObjectIdParamsRequest } from '@core/dto';
import { ControllerModule } from '@core/base';
import { UserService } from '@modules/user/User.service';
import { CreateUserRequest } from '@modules/user/request/CreateUser.dto';

export class UserController extends ControllerModule {
	private service: UserService;

	constructor() {
		super(UserController.name);
		this.service = UserService.getInstance();

		this.getOneUserById = this.getOneUserById.bind(this);
		this.createUser = this.createUser.bind(this);
	}

	/** GET /user/:id */
	public async getOneUserById(
		ctx: HttpContext<
			PathParamsOf<'/user/:id'>,
			any,
			any,
			ValidatedParamsState<ObjectIdParamsRequest>
		>
	) {
		const { id } = ctx.state.validated.params;
		const resp = await this.service.getOneUserById({
			requestId: ctx.requestId,
			id
		});

		const apiResponse = new SuccessResponse(
			HttpStatusCode.OK,
			'User found successfully',
			{
				id: resp.getData()._id
			},
			resp.getData()
		);

		ctx.reply.status(apiResponse.getStatusCode()).json(apiResponse.toJSON());
	}

	/** POST /user */
	public async createUser(
		ctx: HttpContext<
			PathParamsOf<'/user'>,
			any,
			any /** Body */,
			ValidatedBodyState<CreateUserRequest>
		>
	): Promise<void> {
		const { body } = ctx.state.validated;

		const resp = await this.service.createUser({
			requestId: ctx.requestId,
			body
		});

		const apiResponse = new SuccessResponse(
			HttpStatusCode.CREATED,
			'User created successfully',
			{
				id: resp.getData()._id
			},
			resp.getData()
		);

		ctx.reply.status(apiResponse.getStatusCode()).json(apiResponse.toJSON());
	}
}
