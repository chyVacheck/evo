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
import { HttpContextValidated, PathParamsOf } from '@core/types/http';
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
	/**
	 * @description
	 * Получение пользователя по ID.
	 *
	 * @param id - ID пользователя
	 *
	 * @response 200 SuccessResponse - Успешное получение пользователя
	 */
	public async getOneUserById(
		ctx: HttpContextValidated<
			PathParamsOf<'/user/:id'>,
			any,
			ValidatedParamsState<ObjectIdParamsRequest>
		>
	) {
		const { id } = ctx.state.validated.params;
		const resp = await this.service.getOneUserById({
			requestId: ctx.requestId,
			id
		});

		const apiResponse = new SuccessResponse({
			status: HttpStatusCode.OK,
			message: 'User found successfully',
			details: {
				id: resp.getData()._id
			},
			data: resp.getData()
		});

		ctx.reply.status(apiResponse.getStatusCode()).json(apiResponse.toJSON());
	}

	/** POST /user */
	/**
	 * @description
	 * Создание нового пользователя.
	 *
	 * @requestBody CreateUserRequest - Данные для создания пользователя
	 *
	 * @response 201 SuccessResponse - Успешное создание пользователя
	 */
	public async createUser(
		ctx: HttpContextValidated<
			PathParamsOf<'/user'>,
			any,
			ValidatedBodyState<CreateUserRequest>
		>
	): Promise<void> {
		const { body } = ctx.state.validated;

		const resp = await this.service.createUser({
			requestId: ctx.requestId,
			body
		});

		const apiResponse = new SuccessResponse({
			status: HttpStatusCode.CREATED,
			message: 'User created successfully',
			details: {
				id: resp.getData()._id
			},
			data: resp.getData()
		});

		ctx.reply.status(apiResponse.getStatusCode()).json(apiResponse.toJSON());
	}
}
