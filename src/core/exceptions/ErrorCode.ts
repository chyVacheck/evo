/**
 * @file ErrorCode.ts
 * @module core/exceptions
 *
 * @description
 * Перечисление всех кодов ошибок, используемых для формирования ответов API.
 */

/**
 * ! my imports
 */
import { HttpStatusCode } from '@core/http';

/**
 * @description Перечисление всех кодов ошибок и соответствующих HTTP-статусов.
 */
class ErrorCode {
	private static readonly _values: Array<ErrorCode> = [];

	/**
	 * ? === === BAD REQUEST (400) === === ===
	 */

	/**
	 * @description Свойство не известно
	 */
	static readonly UNKNOWN_PROPERTY = new ErrorCode(
		'UNKNOWN_PROPERTY',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Полезная нагрузка пуста
	 */
	static readonly EMPTY_PAYLOAD = new ErrorCode(
		'EMPTY_PAYLOAD',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Некорректный формат JSON
	 */
	static readonly JSON_MALFORMED = new ErrorCode(
		'JSON_MALFORMED',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Ошибка парсинга JSON
	 */
	static readonly JSON_PARSE_ERROR = new ErrorCode(
		'JSON_PARSE_ERROR',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Ошибка сопоставления JSON с моделью
	 */
	static readonly JSON_MAPPING_ERROR = new ErrorCode(
		'JSON_MAPPING_ERROR',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Неверный `header` запроса
	 */
	static readonly INVALID_HEADER = new ErrorCode(
		'INVALID_HEADER',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Отсутствует обязательный `header` запроса
	 */
	static readonly MISSING_HEADER = new ErrorCode(
		'MISSING_HEADER',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Отсутствует обязательное свойство
	 */
	static readonly MISSING_REQUIRED_FIELD = new ErrorCode(
		'MISSING_REQUIRED_FIELD',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Неверные `body` запроса
	 */
	static readonly INVALID_BODY = new ErrorCode(
		'INVALID_BODY',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Неверные `path` параметры запроса
	 */
	static readonly INVALID_PATH_PARAMETERS = new ErrorCode(
		'INVALID_PATH_PARAMETERS',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Неверные `query` параметры запроса
	 */
	static readonly INVALID_QUERY_PARAMETERS = new ErrorCode(
		'INVALID_QUERY_PARAMETERS',
		HttpStatusCode.BAD_REQUEST
	);
	/**
	 * @description Некорректное значение параметра limit (например, меньше 1)
	 */
	static readonly INVALID_PAGINATION_LIMIT = new ErrorCode(
		'INVALID_PAGINATION_LIMIT',
		HttpStatusCode.BAD_REQUEST
	);

	/**
	 * ? === === UNAUTHORIZED (401) === === ===
	 */

	/**
	 * @description Запрос требует аутентификации
	 */
	static readonly UNAUTHORIZED = new ErrorCode(
		'UNAUTHORIZED',
		HttpStatusCode.UNAUTHORIZED
	);
	/**
	 * @description Токен отсутствует
	 */
	static readonly TOKEN_MISSING = new ErrorCode(
		'TOKEN_MISSING',
		HttpStatusCode.UNAUTHORIZED
	);
	/**
	 * @description Токен имеет неверный формат
	 */
	static readonly TOKEN_MALFORMED = new ErrorCode(
		'TOKEN_MALFORMED',
		HttpStatusCode.UNAUTHORIZED
	);
	/**
	 * @description Токен невалиден
	 */
	static readonly TOKEN_INVALID = new ErrorCode(
		'TOKEN_INVALID',
		HttpStatusCode.UNAUTHORIZED
	);
	/**
	 * @description Токен истек
	 */
	static readonly TOKEN_EXPIRED = new ErrorCode(
		'TOKEN_EXPIRED',
		HttpStatusCode.UNAUTHORIZED
	);
	/**
	 * @description Токен был отозван
	 */
	static readonly TOKEN_REVOKED = new ErrorCode(
		'TOKEN_REVOKED',
		HttpStatusCode.UNAUTHORIZED
	);
	/**
	 * @description Неверный пароль
	 */
	static readonly INVALID_PASSWORD = new ErrorCode(
		'INVALID_PASSWORD',
		HttpStatusCode.UNAUTHORIZED
	);

	/**
	 * ? === === PAYMENT REQUIRED (402) === === ===
	 */

	/**
	 * Требуется оплата для доступа к ресурсу
	 */
	static readonly PAYMENT_REQUIRED = new ErrorCode(
		'PAYMENT_REQUIRED',
		HttpStatusCode.PAYMENT_REQUIRED
	);

	/**
	 * ? === === FORBIDDEN (403) === === ===
	 */

	/**
	 * @description Запрос был отклонен сервером
	 */
	static readonly ACCESS_DENIED = new ErrorCode(
		'ACCESS_DENIED',
		HttpStatusCode.FORBIDDEN
	);
	/**
	 * @description Токен имеет недостаточный уровень доступа
	 */
	static readonly INSUFFICIENT_SCOPE = new ErrorCode(
		'INSUFFICIENT_SCOPE',
		HttpStatusCode.FORBIDDEN
	);
	/**
	 * @description Запрос требует наличия определенного IP-адреса
	 */
	static readonly IP_NOT_ALLOWED = new ErrorCode(
		'IP_NOT_ALLOWED',
		HttpStatusCode.FORBIDDEN
	);
	/**
	 * @description Запрос требует наличия определенной роли
	 */
	static readonly ROLE_REQUIRED = new ErrorCode(
		'ROLE_REQUIRED',
		HttpStatusCode.FORBIDDEN
	);

	/**
	 * ? === === NOT FOUND (404) === === ===
	 */

	/**
	 * @description Запрашиваемый ресурс не найден
	 */
	static readonly ENTITY_NOT_FOUND = new ErrorCode(
		'ENTITY_NOT_FOUND',
		HttpStatusCode.NOT_FOUND
	);

	/**
	 * ? === === METHOD NOT ALLOWED (405) === === ===
	 */

	/**
	 * @description Используемый HTTP-метод не поддерживается ресурсом
	 */
	static readonly METHOD_NOT_ALLOWED = new ErrorCode(
		'METHOD_NOT_ALLOWED',
		HttpStatusCode.METHOD_NOT_ALLOWED
	);

	/**
	 * ? === === NOT ACCEPTABLE (406) === === ===
	 */

	/**
	 * @description Клиент не может принять формат ответа
	 */
	static readonly NOT_ACCEPTABLE = new ErrorCode(
		'NOT_ACCEPTABLE',
		HttpStatusCode.NOT_ACCEPTABLE
	);

	/**
	 * ? === === PROXY AUTH REQUIRED (407) === === ===
	 */

	/**
	 * @description Требуется аутентификация через прокси-сервер
	 */
	static readonly PROXY_AUTH_REQUIRED = new ErrorCode(
		'PROXY_AUTH_REQUIRED',
		HttpStatusCode.PROXY_AUTH_REQUIRED
	);

	/**
	 * ? === === REQUEST TIMEOUT (408) === === ===
	 */

	/**
	 * @description Время ожидания запроса истекло
	 */
	static readonly REQUEST_TIMEOUT = new ErrorCode(
		'REQUEST_TIMEOUT',
		HttpStatusCode.REQUEST_TIMEOUT
	);

	/**
	 * ? === === CONFLICT (409) === === ===
	 */

	/**
	 * @description Запрашиваемый ресурс уже существует
	 */
	static readonly ENTITY_ALREADY_EXISTS = new ErrorCode(
		'ENTITY_ALREADY_EXISTS',
		HttpStatusCode.CONFLICT
	);
	/**
	 * @description Версия ресурса конфликтует с текущей версией
	 */
	static readonly VERSION_CONFLICT = new ErrorCode(
		'VERSION_CONFLICT',
		HttpStatusCode.CONFLICT
	);
	/**
	 * @description Значение ETag не соответствует текущей версии ресурса
	 */
	static readonly ETAG_MISMATCH = new ErrorCode(
		'ETAG_MISMATCH',
		HttpStatusCode.CONFLICT
	);
	/**
	 * @description Запрашиваемый ресурс находится в недействительном состоянии
	 */
	static readonly STATE_CONFLICT = new ErrorCode(
		'STATE_CONFLICT',
		HttpStatusCode.CONFLICT
	);
	/**
	 * @description Запрашиваемый ресурс не удален
	 */
	static readonly ENTITY_NOT_DELETED = new ErrorCode(
		'ENTITY_NOT_DELETED',
		HttpStatusCode.CONFLICT
	);
	/**
	 * @description Запрашиваемый ресурс уже удален
	 */
	static readonly ENTITY_ALREADY_DELETED = new ErrorCode(
		'ENTITY_ALREADY_DELETED',
		HttpStatusCode.CONFLICT
	);

	/**
	 * ? === === GONE (410) === === ===
	 */

	/**
	 * @description Ресурс больше недоступен
	 */
	static readonly GONE = new ErrorCode('GONE', HttpStatusCode.GONE);

	/**
	 * ? === === LENGTH REQUIRED (411) === === ===
	 */

	/**
	 * @description Требуется заголовок Content-Length
	 */
	static readonly LENGTH_REQUIRED = new ErrorCode(
		'LENGTH_REQUIRED',
		HttpStatusCode.LENGTH_REQUIRED
	);

	/**
	 * ? === === PRECONDITION FAILED (412) === === ===
	 */

	/**
	 * @description Предварительные условия запроса не выполнены
	 */
	static readonly PRECONDITION_FAILED = new ErrorCode(
		'PRECONDITION_FAILED',
		HttpStatusCode.PRECONDITION_FAILED
	);
	/**
	 * @description Операция отклонена как небезопасная (например, попытка удалить все записи без подтверждения)
	 */
	static readonly UNSAFE_OPERATION = new ErrorCode(
		'UNSAFE_OPERATION',
		HttpStatusCode.PRECONDITION_FAILED
	);

	/**
	 * ? === === PAYLOAD TOO LARGE (413) === === ===
	 */

	/**
	 * @description Запрос слишком большой
	 */
	static readonly PAYLOAD_TOO_LARGE = new ErrorCode(
		'PAYLOAD_TOO_LARGE',
		HttpStatusCode.PAYLOAD_TOO_LARGE
	);

	/**
	 * ? === === URI TOO LONG (414) === === ===
	 */

	/**
	 * @description URI запроса слишком длинный
	 */
	static readonly URI_TOO_LONG = new ErrorCode(
		'URI_TOO_LONG',
		HttpStatusCode.URI_TOO_LONG
	);

	/**
	 * ? === === UNSUPPORTED MEDIA TYPE (415) === === ===
	 */

	/**
	 * @description Тип содержимого запроса не поддерживается сервером
	 * @example application/xml вместо application/json
	 */
	static readonly UNSUPPORTED_MEDIA_TYPE = new ErrorCode(
		'UNSUPPORTED_MEDIA_TYPE',
		HttpStatusCode.UNSUPPORTED_MEDIA_TYPE
	);
	/**
	 * @description Сервер не поддерживает кодировку содержимого запроса
	 */
	static readonly UNSUPPORTED_CONTENT_ENCODING = new ErrorCode(
		'UNSUPPORTED_CONTENT_ENCODING',
		HttpStatusCode.UNSUPPORTED_MEDIA_TYPE
	);

	/**
	 * ? === === RANGE NOT SATISFIABLE (416) === === ===
	 */

	/**
	 * @description Указанный диапазон ресурса недопустим
	 */
	static readonly RANGE_NOT_SATISFIABLE = new ErrorCode(
		'RANGE_NOT_SATISFIABLE',
		HttpStatusCode.RANGE_NOT_SATISFIABLE
	);

	/**
	 * ? === === EXPECTATION FAILED (417) === === ===
	 */

	/**
	 * @description Ожидание по заголовку Expect не выполнено
	 */
	static readonly EXPECTATION_FAILED = new ErrorCode(
		'EXPECTATION_FAILED',
		HttpStatusCode.EXPECTATION_FAILED
	);

	/**
	 * ? === === IM_A_TEAPOT (418) === === ===
	 */

	/**
	 * @description Сервер является чайником
	 */
	static readonly IM_A_TEAPOT = new ErrorCode(
		'IM_A_TEAPOT',
		HttpStatusCode.IM_A_TEAPOT
	);

	/**
	 * ? === === MISDIRECTED REQUEST (421) === === ===
	 */

	/**
	 * @description Запрос направлен на неправильный сервер
	 */
	static readonly MISDIRECTED_REQUEST = new ErrorCode(
		'MISDIRECTED_REQUEST',
		HttpStatusCode.MISDIRECTED_REQUEST
	);

	/**
	 * ? === === UNPROCESSABLE ENTITY (422) === === ===
	 */

	/**
	 * @description Бизнес-логика нарушена
	 */
	static readonly BUSINESS_RULE_VIOLATION = new ErrorCode(
		'BUSINESS_RULE_VIOLATION',
		HttpStatusCode.UNPROCESSABLE_ENTITY
	);
	/**
	 * @description Валидация запроса не прошла
	 * @example некорректное значение поля, нарушены правила Zod-схемы.
	 */
	static readonly VALIDATION_FAILED = new ErrorCode(
		'VALIDATION_FAILED',
		HttpStatusCode.UNPROCESSABLE_ENTITY
	);
	/**
	 * @description Недопустимое значение поля
	 * @example поле age = -5 или price = 0 при запрещённом значении.
	 */
	static readonly INVALID_FIELD_VALUE = new ErrorCode(
		'INVALID_FIELD_VALUE',
		HttpStatusCode.UNPROCESSABLE_ENTITY
	);
	/**
	 * @description Недопустимый тип файла или контента запроса
	 * @example application/json вместо image/png.
	 */
	static readonly UNSUPPORTED_FILE_TYPE = new ErrorCode(
		'UNSUPPORTED_FILE_TYPE',
		HttpStatusCode.UNPROCESSABLE_ENTITY
	);
	/**
	 * @description Размер файла превышает допустимый лимит для данного контекста
	 * @example PNG корректный, но больше 5 МБ.
	 */
	static readonly FILE_SIZE_EXCEEDED = new ErrorCode(
		'FILE_SIZE_EXCEEDED',
		HttpStatusCode.UNPROCESSABLE_ENTITY
	);

	/**
	 * ? === === LOCKED (423) === === ===
	 */

	/**
	 * @description Ресурс заблокирован
	 */
	static readonly LOCKED = new ErrorCode('LOCKED', HttpStatusCode.LOCKED);

	/**
	 * ? === === FAILED DEPENDENCY (424) === === ===
	 */
	/**
	 * @description Зависимый ресурс не был создан
	 */
	static readonly FAILED_DEPENDENCY = new ErrorCode(
		'FAILED_DEPENDENCY',
		HttpStatusCode.FAILED_DEPENDENCY
	);

	/**
	 * ? === === TOO EARLY (425) === === ===
	 */

	/**
	 * @description Сервер не может обработать запрос, так как он слишком рано
	 */
	static readonly TOO_EARLY = new ErrorCode(
		'TOO_EARLY',
		HttpStatusCode.TOO_EARLY
	);

	/**
	 * ? === === UPGRADE REQUIRED (426) === === ===
	 */

	/**
	 * @description Клиент должен обновить протокол
	 */
	static readonly UPGRADE_REQUIRED = new ErrorCode(
		'UPGRADE_REQUIRED',
		HttpStatusCode.UPGRADE_REQUIRED
	);

	/**
	 * ? === === PRECONDITION REQUIRED (428) === === ===
	 */

	/**
	 * @description Клиент должен выполнить предварительные условия
	 */
	static readonly PRECONDITION_REQUIRED = new ErrorCode(
		'PRECONDITION_REQUIRED',
		HttpStatusCode.PRECONDITION_REQUIRED
	);

	/**
	 * ? === === TOO MANY REQUESTS (429) === === ===
	 */

	/**
	 * @description Превышен лимит количества запросов
	 */
	static readonly TOO_MANY_REQUESTS = new ErrorCode(
		'TOO_MANY_REQUESTS',
		HttpStatusCode.TOO_MANY_REQUESTS
	);
	/**
	 * @description Превышен лимит количества запросов
	 */
	static readonly RATE_LIMITED = new ErrorCode(
		'RATE_LIMITED',
		HttpStatusCode.TOO_MANY_REQUESTS
	);

	/**
	 * ? === === REQUEST HEADER FIELDS TOO LARGE (431) === === ===
	 */

	/**
	 * @description Заголовки запроса слишком большие
	 */
	static readonly REQUEST_HEADER_FIELDS_TOO_LARGE = new ErrorCode(
		'REQUEST_HEADER_FIELDS_TOO_LARGE',
		HttpStatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE
	);

	/**
	 * ? === === UNAVAILABLE FOR LEGAL REASONS (451) === === ===
	 */

	/**
	 * @description Ресурс недоступен по юридическим причинам
	 */
	static readonly UNAVAILABLE_FOR_LEGAL_REASONS = new ErrorCode(
		'UNAVAILABLE_FOR_LEGAL_REASONS',
		HttpStatusCode.UNAVAILABLE_FOR_LEGAL_REASONS
	);

	/**
	 * ? === === INTERNAL SERVER ERROR (500) === === ===
	 */

	/**
	 * @description Внутренняя ошибка сервера
	 */
	static readonly INTERNAL_ERROR = new ErrorCode(
		'INTERNAL_ERROR',
		HttpStatusCode.INTERNAL_SERVER_ERROR
	);

	/**
	 * ? === === NOT IMPLEMENTED (501) === === ===
	 */

	/**
	 * @description Метод запроса не поддерживается сервером
	 */
	static readonly NOT_IMPLEMENTED = new ErrorCode(
		'NOT_IMPLEMENTED',
		HttpStatusCode.NOT_IMPLEMENTED
	);

	/**
	 * ? === === BAD GATEWAY (502) === === ===
	 */

	/**
	 * @description Плохой ответ от промежуточного сервера
	 */
	static readonly BAD_GATEWAY = new ErrorCode(
		'BAD_GATEWAY',
		HttpStatusCode.BAD_GATEWAY
	);

	/**
	 * ? === === SERVICE UNAVAILABLE (503) === === ===
	 */

	/**
	 * @description Сервер временно недоступен
	 */
	static readonly SERVICE_UNAVAILABLE = new ErrorCode(
		'SERVICE_UNAVAILABLE',
		HttpStatusCode.SERVICE_UNAVAILABLE
	);
	/**
	 * @description Сервер в режиме обслуживания
	 */
	static readonly MAINTENANCE_MODE = new ErrorCode(
		'MAINTENANCE_MODE',
		HttpStatusCode.SERVICE_UNAVAILABLE
	);
	/**
	 * @description Репозиторий не подтвердил запись
	 */
	static readonly REPOSITORY_WRITE_NOT_ACKNOWLEDGED = new ErrorCode(
		'REPOSITORY_WRITE_NOT_ACKNOWLEDGED',
		HttpStatusCode.SERVICE_UNAVAILABLE
	);

	/**
	 * ? === === GATEWAY TIMEOUT (504) === === ===
	 */

	/**
	 * @description Таймаут при ожидании от промежуточного сервера
	 */
	static readonly GATEWAY_TIMEOUT = new ErrorCode(
		'GATEWAY_TIMEOUT',
		HttpStatusCode.GATEWAY_TIMEOUT
	);

	/**
	 * ? === === HTTP VERSION NOT SUPPORTED (505) === === ===
	 */

	/**
	 * @description HTTP-версия запроса не поддерживается
	 */
	static readonly HTTP_VERSION_NOT_SUPPORTED = new ErrorCode(
		'HTTP_VERSION_NOT_SUPPORTED',
		HttpStatusCode.HTTP_VERSION_NOT_SUPPORTED
	);

	/**
	 * ? === === VARIANT ALSO NEGOTIATES (506) === === ===
	 */

	/**
	 * @description Ошибка согласования вариантов ресурса
	 */
	static readonly VARIANT_ALSO_NEGOTIATES = new ErrorCode(
		'VARIANT_ALSO_NEGOTIATES',
		HttpStatusCode.VARIANT_ALSO_NEGOTIATES
	);

	/**
	 * ? === === INSUFFICIENT STORAGE (507) === === ===
	 */

	/**
	 * @description Недостаточно места на сервере
	 */
	static readonly INSUFFICIENT_STORAGE = new ErrorCode(
		'INSUFFICIENT_STORAGE',
		HttpStatusCode.INSUFFICIENT_STORAGE
	);

	/**
	 * ? === === LOOP DETECTED (508) === === ===
	 */

	/**
	 * @description Обнаружено зацикливание при обработке запроса
	 */
	static readonly LOOP_DETECTED = new ErrorCode(
		'LOOP_DETECTED',
		HttpStatusCode.LOOP_DETECTED
	);

	/**
	 * ? === === BANDWIDTH LIMIT EXCEEDED (509) === === ===
	 */

	/**
	 * @description Превышен лимит пропускной способности
	 */
	static readonly BANDWIDTH_LIMIT_EXCEEDED = new ErrorCode(
		'BANDWIDTH_LIMIT_EXCEEDED',
		HttpStatusCode.BANDWIDTH_LIMIT_EXCEEDED
	);

	/**
	 * ? === === NOT EXTENDED (510) === === ===
	 */

	/**
	 * @description Ресурс не может быть обработан, так как он не был обновлен
	 */
	static readonly NOT_EXTENDED = new ErrorCode(
		'NOT_EXTENDED',
		HttpStatusCode.NOT_EXTENDED
	);

	/**
	 * ? === === NETWORK AUTHENTICATION REQUIRED (511) === === ===
	 */

	/**
	 * @description Необходима аутентификация сети
	 */
	static readonly NETWORK_AUTHENTICATION_REQUIRED = new ErrorCode(
		'NETWORK_AUTHENTICATION_REQUIRED',
		HttpStatusCode.NETWORK_AUTHENTICATION_REQUIRED
	);

	/**
	 * ? === === constructor === === ===
	 */

	private constructor(
		private readonly name: string,
		private readonly httpStatus: HttpStatusCode
	) {
		ErrorCode._values.push(this);
	}

	getName(): string {
		return this.name;
	}

	getHttpStatus(): HttpStatusCode {
		return this.httpStatus;
	}

	toString(): string {
		return `${this.name} (${this.httpStatus.getCode()})`;
	}

	static values(): ErrorCode[] {
		return [...ErrorCode._values];
	}

	static fromName(name: string): ErrorCode | undefined {
		return ErrorCode._values.find(code => code.name === name);
	}
}

Object.freeze(ErrorCode);

export { ErrorCode };
