/**
 * @file index.ts
 * @module core/exceptions
 * @description
 * Модуль, содержащий все исключения, которые могут возникнуть в приложении.
 */

export * from './ErrorCode';
export * from './App.exception';

export * from './AccessDenied.exception';
export * from './BadGateway.exception';
export * from './BandwidthLimitExceeded.exception';
export * from './BusinessRuleViolation.exception';
export * from './EmptyPayload.exception';
export * from './EntityAlreadyDeleted.exception';
export * from './EntityAlreadyExists.exception';
export * from './EntityNotDeleted.exception';
export * from './EntityNotFound.exception';
export * from './EtagMismatch.exception';
export * from './ExpectationFailed.exception';
export * from './FailedDependency.exception';
export * from './FileSizeExceeded.exception';
export * from './GatewayTimeout.exception';
export * from './Gone.exception';
export * from './HttpVersionNotSupported.exception';
export * from './ImATeapot.exception';
export * from './InsufficientScope.exception';
export * from './InsufficientStorage.exception';
export * from './InternalError.exception';
export * from './InvalidBody.exception';
export * from './InvalidFieldValue.exception';
export * from './InvalidHeader.exception';
export * from './InvalidPaginationLimit.exception';
export * from './InvalidPassword.exception';
export * from './InvalidPathParameters.exception';
export * from './InvalidQueryParameters.exception';
export * from './IpNotAllowed.exception';
export * from './JsonMalformed.exception';
export * from './JsonMappingError.exception';
export * from './JsonParseError.exception';
export * from './LengthRequired.exception';
export * from './Locked.exception';
export * from './LoopDetected.exception';
export * from './MaintenanceMode.exception';
export * from './MethodNotAllowed.exception';
export * from './MisdirectedRequest.exception';
export * from './MissingRequiredField.exception';
export * from './NetworkAuthenticationRequired.exception';
export * from './NotAcceptable.exception';
export * from './NotExtended.exception';
export * from './NotImplemented.exception';
export * from './PayloadTooLarge.exception';
export * from './PaymentRequired.exception';
export * from './PreconditionFailed.exception';
export * from './PreconditionRequired.exception';
export * from './ProxyAuthRequired.exception';
export * from './RangeNotSatisfiable.exception';
export * from './RateLimited.exception';
export * from './RepositoryWrite.exception';
export * from './RequestHeaderFieldsTooLarge.exception';
export * from './RequestTimeout.exception';
export * from './RoleRequired.exception';
export * from './ServiceUnavailable.exception';
export * from './StateConflict.exception';
export * from './TokenExpired.exception';
export * from './TokenInvalid.exception';
export * from './TokenMalformed.exception';
export * from './TokenMissing.exception';
export * from './TooEarly.exception';
export * from './TooManyRequests.exception';
export * from './Unauthorized.exception';
export * from './UnavailableForLegalReasons.exception';
export * from './UnknownProperty.exception';
export * from './UnsafeOperation.exception';
export * from './UnsupportedContentEncoding.exception';
export * from './UnsupportedFileType.exception';
export * from './UnsupportedMediaType.exception';
export * from './UpgradeRequired.exception';
export * from './UriTooLong.exception';
export * from './ValidationFailed.exception';
export * from './VariantAlsoNegotiates.exception';
