/**
 * @file Cookie.middleware.ts
 * @module core/middleware
 *
 * @description
 * Before-middleware для парсинга cookies из заголовка `cookie`.
 * Парсит формат: `key=value; key2=value2; ...` и кладёт результат в `ctx.cookies`.
 *
 * Подключать через `useBefore()` на нужных роутерах/роутерах, чтобы не парсить куки глобально.
 *
 * @example
 * ```ts
 * import { CookieMiddleware } from '@core/middleware';
 *
 * router
 *   .useBefore(new CookieMiddleware())
 *   .get('/me', controller.me)
 *   .done();
 * ```
 */

/**
 * ! my imports
 */
import { BeforeMiddlewareModule } from '@core/base';
import { AnyHttpContext } from '@core/types';

/**
 * Парсит cookies из заголовка `cookie` и добавляет их в `ctx.cookies`.
 * Для парсинга используется стандартный формат cookies: `key=value; key2=value2; ...`.
 * Для использования этого миддлвар, нужно добавить его в пайплайн используя метод `useBefore` перед обработкой запроса.
 *
 * @example
 * ```ts
 * import { CookieMiddleware } from '@core/middleware';
 *
 * router
 *   .useBefore(new CookieMiddleware())
 *   .get('/me', controller.me)
 *   .done();
 * ```
 */
export class CookieMiddleware extends BeforeMiddlewareModule<
	typeof CookieMiddleware.name,
	AnyHttpContext,
	AnyHttpContext
> {
	constructor() {
		super(CookieMiddleware.name);
	}

	/**
	 * Выполняет парсинг cookies и передаёт управление дальше.
	 *
	 * @param ctx  Текущий HTTP-контекст
	 * @param next Продолжение конвейера
	 */
	public async handle(
		ctx: AnyHttpContext,
		next: (ctx: AnyHttpContext) => Promise<void>
	): Promise<void> {
		/**
		 * Парсинг cookies начат.
		 */
		this.debug(
			{
				message: 'Start parsing cookies',
				requestId: ctx.requestId
			},
			{ log: { save: false } }
		);

		/**
		 * Берем значение заголовка `cookie`.
		 */
		const cookieHeader = ctx.headers['cookie'];
		/**
		 * Если заголовок `cookie` отсутствует, то пропускаем миддлвар.
		 */
		if (!cookieHeader) {
			this.debug(
				{ message: 'Cookie parse: header is empty', requestId: ctx.requestId },
				{ log: { save: false } }
			);
			return next(ctx);
		}

		const parsed: Record<string, string> = {};
		/**
		 * Парсим cookies из заголовка `cookie`.
		 */
		// Разбиваем по ';' и аккуратно вытаскиваем только первую '=' как разделитель ключ/значение
		for (const raw of cookieHeader.split(';')) {
			const part = raw.trim();
			if (!part) continue;

			const eq = part.indexOf('=');
			// Куки без '=' игнорируем
			if (eq < 0) continue;

			const key = part.slice(0, eq).trim();
			if (!key) continue;

			const rawVal = part.slice(eq + 1).trim();
			let value = rawVal;
			// decodeURIComponent может бросить — страхуемся
			try {
				value = decodeURIComponent(rawVal);
			} catch {
				// оставляем сырое значение, но не падаем
			}

			parsed[key] = value;
		}

		ctx.cookies = parsed;

		/**
		 * Парсинг cookies завершён.
		 */
		this.debug(
			{
				message: 'Cookie parse: done',
				requestId: ctx.requestId,
				details: { keys: Object.keys(parsed) }
			},
			{ log: { save: false } }
		);

		await next(ctx);
	}
}
