import { Endpoints } from "../endpoints";
import { MessageEventRunner } from "discord/events/message";
import { ProfileAction } from "./profile";
import { RequestAction } from "./request";
import { UserAction } from "./user";
import { basePhrase } from "./command";

export class MessageRouter {
  private readonly event: MessageEventRunner;
  private readonly endpoints: Endpoints;

  constructor(event: MessageEventRunner, endpoints: Endpoints) {
    this.event = event;
    this.endpoints = endpoints;
  }

  public registerActions() {
    const actions = {
      profile: new ProfileAction(this.endpoints.profile),
      request: new RequestAction(this.endpoints.request),
      user: new UserAction(this.endpoints.user)
    } as const;

    this.event.registerCreateCommandEvent((message, command) => actions.profile.delete(message, command), {
      prefixes: [`${basePhrase} profile delete`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.profile.random(message, command), {
      prefixes: [`${basePhrase} profile random`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.profile.search(message, command), {
      prefixes: [`${basePhrase} profile search`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.profile.show(message, command), {
      prefixes: [`${basePhrase} profile show`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.request.accept(message, command), {
      prefixes: [`${basePhrase} request accept`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.request.cancel(message, command), {
      prefixes: [`${basePhrase} request cancel`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.request.deny(message, command), {
      prefixes: [`${basePhrase} request deny`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.request.search(message, command), {
      prefixes: [`${basePhrase} request search`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.request.send(message, command), {
      prefixes: [`${basePhrase} request send`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message, command) => actions.request.show(message, command), {
      prefixes: [`${basePhrase} request show`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent((message) => actions.user.register(message), {
      prefixes: [`${basePhrase} user register`],
      allowBot: false
    });
  }
}
