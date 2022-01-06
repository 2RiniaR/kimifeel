export interface UserEndpointResponder {
  register(clientDiscordId: string): PromiseLike<void>;
  unregister(clientDiscordId: string): PromiseLike<void>;
}

export class UserEndpoint {
  readonly responder: UserEndpointResponder;

  constructor(responder: UserEndpointResponder) {
    this.responder = responder;
  }

  register(clientDiscordId: string): PromiseLike<void> {
    return this.responder.register(clientDiscordId);
  }

  unregister(clientDiscordId: string): PromiseLike<void> {
    return this.responder.unregister(clientDiscordId);
  }
}
