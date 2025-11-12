/**
 * @file Api.router.ts
 * @module modules/Api
 */

/**
 * ! my imports
 */
import { AppContext } from '@core/types';
import { RouterModule } from '@core/base';
import { UserRouter } from '@modules/user/User.router';
import { FileRouter } from '@modules/file/File.router';

export class ApiRouter extends RouterModule<AppContext> {
	constructor() {
		super(ApiRouter.name, '/api');

		this.mount(new FileRouter());
		this.mount(new UserRouter());
	}
}
