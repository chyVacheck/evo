/**
 * @file Api.router.ts
 * @module modules/Api
 */

/**
 * ! my imports
 */
import { AnyHttpContext } from '@core/types';
import { RouterModule } from '@core/base';
import { HealthRouter } from '@modules/health/Health.router';
import { UserRouter } from '@modules/user/User.router';

type Base = AnyHttpContext;

export class ApiRouter extends RouterModule<Base> {
	constructor() {
		super(ApiRouter.name, '/api');

		this.mount(new UserRouter());
	}
}
