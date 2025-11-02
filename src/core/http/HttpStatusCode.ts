/**
 * @file HttpStatusCode.ts
 * @module core/http
 *
 * @description
 * Перечисление всех основных HTTP-статусов, используемых для формирования ответов API.
 *
 * @details
 * Группы статусов:
 * - 2xx — Успешные ответы (Success)
 * - 4xx — Ошибки клиента (Client Error)
 * - 5xx — Ошибки сервера (Server Error)
 *
 * Каждый статус включает в себя числовой код, который может быть использован для построения SuccessResponse или ErrorResponse.
 *
 * Примеры использования:
 * - HttpStatusCode.OK (200)
 * - HttpStatusCode.NOT_FOUND (404)
 * - HttpStatusCode.INTERNAL_SERVER_ERROR (500)
 *
 * Методы:
 * - getName(): получить название кода
 * - getCode(): получить числовой код статуса
 * - isSuccess(): проверить, является ли статус успешным (2xx–3xx)
 *
 * @example
 * ```ts
 * HttpStatusCode code = HttpStatusCode.CREATED;
 * if (code.isSuccess()) { ... }
 * ```
 */

class HttpStatusCode {
	static _values: Array<HttpStatusCode> = [];

	/**
	 * ? === === Success (2xx) === === ===
	 */

	/**
	 * 200 OK
	 * Запрос успешно выполнен
	 */
	static OK = new HttpStatusCode(200, 'OK');
	/**
	 * 201 CREATED
	 * Успешно создан новый ресурс
	 */
	static CREATED = new HttpStatusCode(201, 'CREATED');
	/**
	 * 202 ACCEPTED
	 * Запрос принят, но еще не обработан
	 */
	static ACCEPTED = new HttpStatusCode(202, 'ACCEPTED');
	/**
	 * 203 NON AUTHORITATIVE INFORMATION
	 * Информация получена, но не от первоисточника
	 */
	static NON_AUTHORITATIVE_INFO = new HttpStatusCode(
		203,
		'NON_AUTHORITATIVE_INFO'
	);
	/**
	 * 204 NO CONTENT
	 * Запрос выполнен, но тело ответа пустое
	 */
	static NO_CONTENT = new HttpStatusCode(204, 'NO_CONTENT');
	/**
	 * 205 RESET CONTENT
	 * Клиенту нужно сбросить представление (например, очистить форму)
	 */
	static RESET_CONTENT = new HttpStatusCode(205, 'RESET_CONTENT');
	/**
	 * 206 PARTIAL CONTENT
	 * Отправлена только часть ресурса
	 */
	static PARTIAL_CONTENT = new HttpStatusCode(206, 'PARTIAL_CONTENT');
	/**
	 * 207 MULTI STATUS
	 * Запрос выполнен, но содержит несколько под-ответов
	 */
	static MULTI_STATUS = new HttpStatusCode(207, 'MULTI_STATUS');
	/**
	 * 208 ALREADY REPORTED
	 * Элемент уже был перечислен в предыдущем ответе
	 */
	static ALREADY_REPORTED = new HttpStatusCode(208, 'ALREADY_REPORTED');
	/**
	 * 226 IM USED
	 * Сервер применил к ресурсу манипуляции
	 */
	static IM_USED = new HttpStatusCode(226, 'IM_USED');

	/**
	 * ? === === Redirect (3xx) === === ===
	 */

	/**
	 * 300 MULTIPLE CHOICES
	 * Ресурс имеет несколько вариантов представления
	 */
	static MULTIPLE_CHOICES = new HttpStatusCode(300, 'MULTIPLE_CHOICES');
	/**
	 * 301 MOVED PERMANENTLY
	 * Ресурс был перемещен, на постоянной основе, на новый URL
	 */
	static MOVED_PERMANENTLY = new HttpStatusCode(301, 'MOVED_PERMANENTLY');
	/**
	 * 302 FOUND
	 * Ресурс был временно перемещен на новый URL, но запрос следует продолжать по старому
	 */
	static FOUND = new HttpStatusCode(302, 'FOUND');
	/**
	 * 303 SEE OTHER
	 * Ресурс был перемещен на новый URL
	 */
	static SEE_OTHER = new HttpStatusCode(303, 'SEE_OTHER');
	/**
	 * 304 NOT MODIFIED
	 * Ресурс не был изменен с момента последнего запроса
	 */
	static NOT_MODIFIED = new HttpStatusCode(304, 'NOT_MODIFIED');
	/**
	 * 307 TEMPORARY REDIRECT
	 * Ресурс был временно перемещен на новый URL, но запрос следует продолжать по старому
	 */
	static TEMPORARY_REDIRECT = new HttpStatusCode(307, 'TEMPORARY_REDIRECT');
	/**
	 * 308 PERMANENT REDIRECT
	 * Ресурс был перемещен, на постоянной основе, на новый URL
	 */
	static PERMANENT_REDIRECT = new HttpStatusCode(308, 'PERMANENT_REDIRECT');

	/**
	 * ? === === Client Error (4xx) === === ===
	 */

	/**
	 * 400 BAD REQUEST
	 * Неверный запрос
	 */
	static BAD_REQUEST = new HttpStatusCode(400, 'BAD_REQUEST');
	/**
	 * 401 UNAUTHORIZED
	 * Требуется аутентификация
	 */
	static UNAUTHORIZED = new HttpStatusCode(401, 'UNAUTHORIZED');
	/**
	 * 402 PAYMENT REQUIRED
	 * Требуется оплата
	 */
	static PAYMENT_REQUIRED = new HttpStatusCode(402, 'PAYMENT_REQUIRED');
	/**
	 * 403 FORBIDDEN
	 * Доступ запрещен
	 */
	static FORBIDDEN = new HttpStatusCode(403, 'FORBIDDEN');
	/**
	 * 404 NOT FOUND
	 * Ресурс не найден
	 */
	static NOT_FOUND = new HttpStatusCode(404, 'NOT_FOUND');
	/**
	 * 405 METHOD NOT ALLOWED
	 * HTTP-метод не поддерживается
	 */
	static METHOD_NOT_ALLOWED = new HttpStatusCode(405, 'METHOD_NOT_ALLOWED');
	/**
	 * 406 NOT ACCEPTABLE
	 * Клиент не может принять ответ в данном формате
	 */
	static NOT_ACCEPTABLE = new HttpStatusCode(406, 'NOT_ACCEPTABLE');
	/**
	 * 407 PROXY AUTH REQUIRED
	 * Требуется аутентификация через прокси
	 */
	static PROXY_AUTH_REQUIRED = new HttpStatusCode(407, 'PROXY_AUTH_REQUIRED');
	/**
	 * 408 REQUEST TIMEOUT
	 * Время ожидания запроса истекло
	 */
	static REQUEST_TIMEOUT = new HttpStatusCode(408, 'REQUEST_TIMEOUT');
	/**
	 * 409 CONFLICT
	 * Конфликт в запросе
	 */
	static CONFLICT = new HttpStatusCode(409, 'CONFLICT');
	/**
	 * 410 GONE
	 * Ресурс больше недоступен
	 */
	static GONE = new HttpStatusCode(410, 'GONE');
	/**
	 * 411 LENGTH REQUIRED
	 * Требуется заголовок Content-Length
	 */
	static LENGTH_REQUIRED = new HttpStatusCode(411, 'LENGTH_REQUIRED');
	/**
	 * 412 PRECONDITION FAILED
	 * Ошибки предварительных условий
	 */
	static PRECONDITION_FAILED = new HttpStatusCode(412, 'PRECONDITION_FAILED');
	/**
	 * 413 PAYLOAD TOO LARGE
	 * Тело запроса слишком большое
	 */
	static PAYLOAD_TOO_LARGE = new HttpStatusCode(413, 'PAYLOAD_TOO_LARGE');
	/**
	 * 414 URI TOO LONG
	 * URI слишком длинный
	 */
	static URI_TOO_LONG = new HttpStatusCode(414, 'URI_TOO_LONG');
	/**
	 * 415 UNSUPPORTED MEDIA TYPE
	 * Тип содержимого не поддерживается
	 */
	static UNSUPPORTED_MEDIA_TYPE = new HttpStatusCode(
		415,
		'UNSUPPORTED_MEDIA_TYPE'
	);
	/**
	 * 416 RANGE NOT SATISFIABLE
	 * Указанный диапазон недопустим
	 */
	static RANGE_NOT_SATISFIABLE = new HttpStatusCode(
		416,
		'RANGE_NOT_SATISFIABLE'
	);
	/**
	 * 417 EXPECTATION FAILED
	 * Ошибка выполнения заголовка Expect
	 */
	static EXPECTATION_FAILED = new HttpStatusCode(417, 'EXPECTATION_FAILED');
	/**
	 * ! not recommended to use in production
	 * 418 I'M A TEAPOT
	 * Сервер не может приготовить кофе, так как он является чайником
	 */
	static IM_A_TEAPOT = new HttpStatusCode(418, 'IM_A_TEAPOT');
	/**
	 * 421 MISDIRECTED REQUEST
	 * Запрос направлен на несуществующий ресурс
	 */
	static MISDIRECTED_REQUEST = new HttpStatusCode(421, 'MISDIRECTED_REQUEST');
	/**
	 * 422 UNPROCESSABLE ENTITY
	 * Ошибка валидации данных
	 */
	static UNPROCESSABLE_ENTITY = new HttpStatusCode(422, 'UNPROCESSABLE_ENTITY');
	/**
	 * 423 LOCKED
	 * Ресурс заблокирован
	 */
	static LOCKED = new HttpStatusCode(423, 'LOCKED');
	/**
	 * 424 FAILED DEPENDENCY
	 * Ошибка в зависимом ресурсе
	 */
	static FAILED_DEPENDENCY = new HttpStatusCode(424, 'FAILED_DEPENDENCY');
	/**
	 * 425 TOO EARLY
	 * Сервер не может обработать запрос, так как он слишком рано
	 */
	static TOO_EARLY = new HttpStatusCode(425, 'TOO_EARLY');
	/**
	 * 426 UPGRADE REQUIRED
	 * Клиент должен обновить протокол
	 */
	static UPGRADE_REQUIRED = new HttpStatusCode(426, 'UPGRADE_REQUIRED');
	/**
	 * 428 PRECONDITION REQUIRED
	 * Требуется предварительное условие
	 */
	static PRECONDITION_REQUIRED = new HttpStatusCode(
		428,
		'PRECONDITION_REQUIRED'
	);
	/**
	 * 429 TOO MANY REQUESTS
	 * Слишком много запросов (rate-limit)
	 */
	static TOO_MANY_REQUESTS = new HttpStatusCode(429, 'TOO_MANY_REQUESTS');
	/**
	 * 431 REQUEST HEADER FIELDS TOO LARGE
	 * Заголовки запроса слишком большие
	 */
	static REQUEST_HEADER_FIELDS_TOO_LARGE = new HttpStatusCode(
		431,
		'REQUEST_HEADER_FIELDS_TOO_LARGE'
	);
	/**
	 * 451 UNAVAILABLE FOR LEGAL REASONS
	 * Ресурс недоступен по юридическим причинам
	 */
	static UNAVAILABLE_FOR_LEGAL_REASONS = new HttpStatusCode(
		451,
		'UNAVAILABLE_FOR_LEGAL_REASONS'
	);

	/**
	 * ? === === Server Error (5xx) === === ===
	 */

	/**
	 * 500 INTERNAL SERVER ERROR
	 * Внутренняя ошибка сервера
	 */
	static INTERNAL_SERVER_ERROR = new HttpStatusCode(
		500,
		'INTERNAL_SERVER_ERROR'
	);
	/**
	 * 501 NOT IMPLEMENTED
	 * Метод не поддерживается сервером
	 */
	static NOT_IMPLEMENTED = new HttpStatusCode(501, 'NOT_IMPLEMENTED');
	/**
	 * 502 BAD GATEWAY
	 * Плохой ответ от другого сервера
	 */
	static BAD_GATEWAY = new HttpStatusCode(502, 'BAD_GATEWAY');
	/**
	 * 503 SERVICE UNAVAILABLE
	 * Сервер временно недоступен
	 */
	static SERVICE_UNAVAILABLE = new HttpStatusCode(503, 'SERVICE_UNAVAILABLE');
	/**
	 * 504 GATEWAY TIMEOUT
	 * Таймаут при ожидании ответа
	 */
	static GATEWAY_TIMEOUT = new HttpStatusCode(504, 'GATEWAY_TIMEOUT');
	/**
	 * 505 HTTP VERSION NOT SUPPORTED
	 * HTTP-версия не поддерживается
	 */
	static HTTP_VERSION_NOT_SUPPORTED = new HttpStatusCode(
		505,
		'HTTP_VERSION_NOT_SUPPORTED'
	);
	/**
	 * 506 VARIANT ALSO NEGOTIATES
	 * Ошибка согласования
	 */
	static VARIANT_ALSO_NEGOTIATES = new HttpStatusCode(
		506,
		'VARIANT_ALSO_NEGOTIATES'
	);
	/**
	 * 507 INSUFFICIENT STORAGE
	 * Недостаточно места на сервере
	 */
	static INSUFFICIENT_STORAGE = new HttpStatusCode(507, 'INSUFFICIENT_STORAGE');
	/**
	 * 508 LOOP DETECTED
	 * Обнаружено зацикливание
	 */
	static LOOP_DETECTED = new HttpStatusCode(508, 'LOOP_DETECTED');
	/**
	 * ! not standard
	 * 509 BANDWIDTH LIMIT EXCEEDED
	 * Превышен лимит пропускной способности
	 */
	static BANDWIDTH_LIMIT_EXCEEDED = new HttpStatusCode(
		509,
		'BANDWIDTH_LIMIT_EXCEEDED'
	);
	/**
	 * 510 NOT EXTENDED
	 * Ресурс не может быть обработан, так как он не был обновлен
	 * @see [NOT EXTENDED](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/510)
	 */
	static NOT_EXTENDED = new HttpStatusCode(510, 'NOT_EXTENDED');
	/**
	 * 511 NETWORK AUTHENTICATION REQUIRED
	 * Требуется аутентификация через сеть
	 * @see [NETWORK_AUTHENTICATION_REQUIRED](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/511)
	 */
	static NETWORK_AUTHENTICATION_REQUIRED = new HttpStatusCode(
		511,
		'NETWORK_AUTHENTICATION_REQUIRED'
	);

	/**
	 * @param {number} code HTTP status code
	 * @param {string} name Status name
	 */
	private constructor(
		protected readonly code: number,
		protected readonly name: string
	) {
		HttpStatusCode._values.push(this);
	}

	/** @returns {string} названия кода */
	getName(): string {
		return this.name;
	}

	/** @returns {number} числовой код */
	getCode(): number {
		return this.code;
	}

	/** @returns {boolean} true если успешный (2xx–3xx) */
	isSuccess(): boolean {
		return this.code >= 200 && this.code < 400;
	}

	/** @returns {string} строковое представление */
	toString(): string {
		return `${this.name} (${this.code})`;
	}

	/** Получить все статусы (для перечисления, фильтрации и т.п.) */
	static values() {
		return [...HttpStatusCode._values];
	}

	/** Получить статус по числовому коду */
	static fromCode(code: number) {
		return HttpStatusCode._values.find(status => status.code === code);
	}
}

Object.freeze(HttpStatusCode);

export { HttpStatusCode };
