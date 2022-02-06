export type AuthParams = { discordId: string };

export type AuthResult = { clientId: string };

export interface AuthEndpointResponder {
  register(params: AuthParams): PromiseLike<AuthResult>;
  unregister(params: AuthParams): PromiseLike<AuthResult>;
  authorize(params: AuthParams): PromiseLike<AuthResult>;
}

export class AuthEndpoint {
  constructor(private readonly responder: AuthEndpointResponder) {}

  register(params: AuthParams): PromiseLike<AuthResult> {
    return this.responder.register(params);
  }

  unregister(params: AuthParams): PromiseLike<AuthResult> {
    return this.responder.unregister(params);
  }

  authorize(params: AuthParams): PromiseLike<AuthResult> {
    return this.responder.authorize(params);
  }
}
