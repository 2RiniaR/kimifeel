export abstract class EndpointError extends Error {}
export class UserNotFoundError extends EndpointError {}
export class UserAlreadyRegisteredError extends EndpointError {}
export class UnavailableError extends EndpointError {}
