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
import { ConfigUserAction, RegisterUserAction, ShowStatsUserAction } from "./user";
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

    this.event.registerCreateCommandEvent(new CreateProfileAction(this.endpoints), {
      prefixes: [`${basePhrase} profile create`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new DeleteProfileAction(this.endpoints), {
      prefixes: [`${basePhrase} profile delete`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RandomProfileAction(this.endpoints), {
      prefixes: [`${basePhrase} profile random`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchProfileAction(this.endpoints), {
      prefixes: [`${basePhrase} profile search`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowProfileAction(this.endpoints), {
      prefixes: [`${basePhrase} profile show`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new AcceptRequestAction(this.endpoints), {
      prefixes: [`${basePhrase} request accept`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new CancelRequestAction(this.endpoints), {
      prefixes: [`${basePhrase} request cancel`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new DenyRequestAction(this.endpoints), {
      prefixes: [`${basePhrase} request deny`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SearchRequestAction(this.endpoints), {
      prefixes: [`${basePhrase} request search`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new SendRequestAction(this.endpoints), {
      prefixes: [`${basePhrase} request send`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowRequestAction(this.endpoints), {
      prefixes: [`${basePhrase} request show`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new RegisterUserAction(this.endpoints), {
      prefixes: [`${basePhrase} user register`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ShowStatsUserAction(this.endpoints), {
      prefixes: [`${basePhrase} user stats`],
      allowBot: false
    });

    this.event.registerCreateCommandEvent(new ConfigUserAction(this.endpoints), {
      prefixes: [`${basePhrase} user config`],
      allowBot: false
    });
  }
}
