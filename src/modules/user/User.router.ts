/**
 * @file User.router.ts
 * @module modules/user
 * @description
 * Маршрутизация пользовательских запросов.
 *
 * @routes
 * - `GET /users/:id` - Получить пользователя по ID
 * - `POST /users` - Создать нового пользователя
 */

/**
 * ! my imports
 */
import { RouterModule } from '@core/base';
import { AnyHttpContext } from '@core/types/http/context';
import {
	ValidateBodyMiddleware,
	ValidateParamsMiddleware
} from '@core/middleware';
import { ObjectIdParamsSchema } from '@core/dto';
import { UserController } from '@modules/user/User.controller';
import { CreateUserSchema } from '@modules/user/request/CreateUser.request';

export class UserRouter extends RouterModule<AnyHttpContext> {
	private readonly controller = new UserController();

	constructor() {
		super(UserRouter.name, '/users');

		this.get('/:id', this.controller.getOneUserById)
			.useBefore(new ValidateParamsMiddleware(ObjectIdParamsSchema))
			.done();

		this.post('/', this.controller.createUser)
			.useBefore(new ValidateBodyMiddleware(CreateUserSchema))
			.done();
	}
}
