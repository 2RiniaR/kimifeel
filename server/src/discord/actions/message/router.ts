import { Endpoints } from "../endpoints";
import { MessageEventRunner } from "discord/events/message";
import { basePhrase } from "./command";
import {
  CreateProfileAction,
  DeleteProfileAction,
  RandomProfileAction,
  SearchProfileAction,
  ShowProfileAction
} from "./profile";
import {
  AcceptRequestAction,
  CancelRequestAction,
  DenyRequestAction,
  SearchRequestAction,
  SendRequestAction,
  ShowRequestAction
} from "./request";
import { RegisterUserAction } from "./user";
import { HelpAction } from "./help";

export class MessageRouter {
  private readonly event: MessageEventRunner;
  private readonly endpoints: Endpoints;

  constructor(event: MessageEventRunner, endpoints: Endpoints) {
    this.event = event;
    this.endpoints = endpoints;
  }

  public registerActions() {
    this.event.registerCreateCommandEvent(new HelpAction(), {
      prefixes: [`${basePhrase} help`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new CreateProfileAction(this.endpoints.profile), {
      prefixes: [`${basePhrase} profile create`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new DeleteProfileAction(this.endpoints.profile), {
      prefixes: [`${basePhrase} profile delete`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RandomProfileAction(this.endpoints.profile), {
      prefixes: [`${basePhrase} profile random`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchProfileAction(this.endpoints.profile), {
      prefixes: [`${basePhrase} profile search`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowProfileAction(this.endpoints.profile), {
      prefixes: [`${basePhrase} profile show`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new AcceptRequestAction(this.endpoints.request), {
      prefixes: [`${basePhrase} request accept`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new CancelRequestAction(this.endpoints.request), {
      prefixes: [`${basePhrase} request cancel`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new DenyRequestAction(this.endpoints.request), {
      prefixes: [`${basePhrase} request deny`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchRequestAction(this.endpoints.request), {
      prefixes: [`${basePhrase} request search`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SendRequestAction(this.endpoints.request), {
      prefixes: [`${basePhrase} request send`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowRequestAction(this.endpoints.request), {
      prefixes: [`${basePhrase} request show`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RegisterUserAction(this.endpoints.user), {
      prefixes: [`${basePhrase} user register`],
      allowBot: false
    });
  }
}
