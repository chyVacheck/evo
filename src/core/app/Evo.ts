/**
 * @file App.ts
 * @module core/app
 *
 * @description
 * Класс приложения, выступающий корневым роутером ('/'),
 * с удобными методами:
 * - use(router) — монтирование дочерних роутеров
 * - useBefore/useAfter/finally — глобальные middleware (унаследованы)
 * - listen/close — управление HTTP-сервером
 */

import http from 'http';

/**
 * ! my imports
 */
import {
	AnyHttpContext,
	HttpPath,
	IBeforeMiddlewareModule,
	IAfterMiddlewareModule,
	IFinallyMiddlewareModule,
	EModuleType
} from '@core/types';
import { RouterModule } from '@core/base';
import { ErrorHandlerMiddleware } from '@core/middleware';

export type ListenOptions = {
	port: number;
	host?: string; // по умолчанию '0.0.0.0'
	backlog?: number;
	/**
	 * Если true — не падать при повторном вызове listen(),
	 * а молча вернуть тот же инстанс.
	 */
	idempotent?: boolean;
};

export class Evo<
	Base extends AnyHttpContext = AnyHttpContext
> extends RouterModule<typeof Evo.name, Base> {
	private server: http.Server | null = null;

	constructor(prefix: HttpPath = '/') {
		super(Evo.name, prefix);
		this.setModuleType(EModuleType.SYSTEM);
		this.debug({ message: 'Evo constructor' });
		// Глобальная finally-мидлвара на всё приложение
		this.finally(new ErrorHandlerMiddleware());
	}

	/**
	 * Монтирование одного или нескольких роутеров.
	 *
	 * @example
	 * const app = new App();
	 * app.use(new ApiRouter(), new AdminRouter());
	 */
	public use(...routers: Array<RouterModule<any, Base>>): this {
		for (const r of routers) {
			this.mount(r);
		}
		return this;
	}

	/**
	 * Сахар для одновременной регистрации глобальных middleware разных типов.
	 * Можно не пользоваться — унаследованные useBefore/useAfter/finally уже подходят.
	 *
	 * @example
	 * app.useMiddlewares({ before: [auth], after: [metrics], finally: [errors] })
	 */
	public useMiddlewares(opts: {
		before?: Array<IBeforeMiddlewareModule<any, Base, any>>;
		after?: Array<IAfterMiddlewareModule<any, Base>>;
		finally?: Array<IFinallyMiddlewareModule<any, Base, any>>;
	}): this {
		if (opts.before?.length) this.useBefore(...opts.before);
		if (opts.after?.length) this.useAfter(...opts.after);
		if (opts.finally?.length) this.finally(...opts.finally);
		return this;
	}

	/**
	 * Создаёт http.Server и вешает обработчик запросов на текущий роутер.
	 * Вызывается внутри listen(), но может быть полезен, если нужен доступ
	 * к server до старта (например, для .headersTimeout и т.п.).
	 */
	public createServer(): http.Server {
		if (this.server) return this.server;
		this.server = http.createServer((req, res) => {
			// Не забываем, что handleRequest — async, но http сам не ждёт промис;
			// ошибок не бросаем наружу — finally/глобальные обработчики это закроют.
			void this.handleRequest(req, res);
		});
		return this.server;
	}

	/**
	 * Запуск сервера.
	 */
	public async listen(opts: ListenOptions): Promise<http.Server> {
		const { port, host = '0.0.0.0', backlog, idempotent = true } = opts;

		const srv = this.createServer();

		// Защита от двойного запуска
		if (srv.listening) {
			if (idempotent) return srv;
			this.fatal(
				{ message: 'Server is already listening', details: { port, host } },
				{ log: { save: false } }
			);
			throw new Error('Server is already listening');
		}

		await new Promise<void>((resolve, reject) => {
			const onError = (err: Error & { code?: string }) => {
				srv.off('listening', onListening);
				reject(err);
			};
			const onListening = () => {
				srv.off('error', onError);
				resolve();
			};
			srv.once('error', onError);
			srv.once('listening', onListening);
			if (backlog !== undefined) srv.listen(port, host, backlog);
			else srv.listen(port, host);
		});

		const addr = this.address();
		this.info(
			{
				message: `Server running on http://${
					addr?.address === '::' ? 'localhost' : addr?.address
				}:${addr?.port}`
			},
			{ log: { save: true } }
		);

		return srv;
	}

	/**
	 * Корректная остановка сервера.
	 */
	public async close(): Promise<void> {
		if (!this.server) return;
		const srv = this.server;
		this.server = null;

		if (!srv.listening) return;

		await new Promise<void>((resolve, reject) => {
			srv.close(err => (err ? reject(err) : resolve()));
		});
	}

	/**
	 * Утилита для получения текущего адреса сервера.
	 */
	public address(): { address: string; port: number } | undefined {
		if (!this.server) return undefined;
		const addr = this.server.address();
		if (!addr || typeof addr === 'string') return undefined;
		return { address: addr.address, port: addr.port };
	}

	/**
	 * Быстрый дамп всех маршрутов (метод + путь), пригодится для логов при старте.
	 */
	public printRoutes(): void {
		const rows = this.listRoutes()
			.sort(
				(a, b) =>
					a.path.localeCompare(b.path) || a.method.localeCompare(b.method)
			)
			.map(r => `${r.method.padEnd(5, ' ')} ${r.path}`);

		this.info({
			message: `📚 Routes (${this.listRoutes().length}):`
		});
		rows.forEach(row => this.info({ message: row }));
	}
}
