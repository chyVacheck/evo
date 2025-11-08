/**
 * @file ErrorHandler.middleware.ts
 * @module core/middleware
 *
 * @description
 * Finally-middleware для обработки ошибок.
 * Ловит ошибки и возвращает их в виде ответа API.
 *
 * Подключать через `finally()` на глобальных роутерах.
 */

/**
 * ! my imports
 */
import { FinallyMiddlewareModule } from '@core/base';
import { AppException, ErrorCode } from '@core/exceptions';
import { ErrorResponse } from '@core/http/ErrorResponse';
import { AnyHttpContext } from '@core/types';

export class ErrorHandlerMiddleware extends FinallyMiddlewareModule<
	AnyHttpContext,
	Error
> {
	constructor() {
		super(ErrorHandlerMiddleware.name);
	}

	/**
	 * Обрабатывает ошибки и возвращает их в виде ответа API.
	 *
	 * @param ctx  Текущий HTTP-контекст
	 * @param error Ошибка, возникшая в процессе запроса
	 */
	public async handle(ctx: AnyHttpContext, error?: Error): Promise<void> {
		// Если ошибки нет, то ничего не делаем
		if (!error) return;

		/**
		 * Если ошибка является экземпляром AppException, то возвращаем ее в виде ответа API.
		 */
		if (error instanceof AppException) {
			this.error({
				message: 'Error handled',
				requestId: ctx.requestId,
				details: {
					message: error.getMessage(),
					origin: error.origin,
					errorCode: error.code,
					errorDetails: error.details,
					errors: error.errors
				},
				error: error
			});
			const response = new ErrorResponse({
				errorCode: error.getErrorCode(),
				message: error.getMessage(),
				errors: error.getErrors(),
				details: error.getDetails()
			});

			ctx.reply.status(response.getStatusCode());
			ctx.reply.json(response.toJSON());
		} else {
			this.error({
				message: error.message,
				requestId: ctx.requestId,
				error: error
			});

			const response = new ErrorResponse({
				errorCode: ErrorCode.INTERNAL_ERROR,
				message: error.message,
				errors: null,
				details: null
			});

			ctx.reply.status(response.getStatusCode());

			ctx.reply.json(response.toJSON());
		}
	}
}
