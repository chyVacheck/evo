/**
 * @file System.middleware.ts
 * @module core/middleware
 *
 * @description
 * Системная before-middleware. Гарантирует наличие инвариантов в контексте:
 * - requestId: string // Идентификатор запроса
 * - startedAt: number // Время начала обработки запроса
 * - clientIp: string // IP-адрес клиента
 *
 * Не модифицирует ctx.state.
 */

/**
 * ! my imports
 */
import { BeforeMiddlewareModule } from '@core/base';
import { AnyHttpContext } from '@core/types';
import { CryptoUtils } from '@core/utils';

function extractClientIp(ctx: AnyHttpContext): string {
	const xForward = ctx.headers['x-forwarded-for'];
	if (xForward) {
		// x-forwarded-for: "client, proxy1, proxy2"
		const first = xForward.split(',')[0]?.trim();
		if (first) return first;
	}
	// Fallback на сокет
	return (ctx.rawReq.socket.remoteAddress ?? '') || '';
}

export class SystemMiddleware extends BeforeMiddlewareModule<
	typeof SystemMiddleware.name,
	AnyHttpContext
> {
	constructor() {
		super(SystemMiddleware.name);
	}

	/**
	 * Гарантирует, что инварианты заполнены.
	 * - requestId: string // Идентификатор запроса
	 * - startedAt: number // Время начала обработки запроса
	 * - clientIp: string // IP-адрес клиента
	 * @param ctx - HTTP-контекст запроса
	 * @param next - Функция для вызова следующего middleware
	 */
	public async handle(
		ctx: AnyHttpContext,
		next: (ctx: AnyHttpContext) => Promise<void>
	) {
		/**
		 * Генерируем requestId, если он ещё не был установлен.
		 */
		ctx.requestId = CryptoUtils.genRandomString();
		/**
		 * Записываем время начала обработки запроса.
		 */
		ctx.startedAt = Date.now();
		/**
		 * Записываем IP-адрес клиента, если он ещё не был установлен.
		 */
		ctx.clientIp = ctx.clientIp || extractClientIp(ctx);

		await next(ctx);
	}
}
