import { RequestEndpointResponder } from "../endpoints/request";
import * as Endpoint from "../endpoints/request";
import * as EndpointError from "../endpoints/errors";
import { Controller } from "./base";
import { ForbiddenError } from "../models/errors";
import { ClientUser, ContentLengthLimitError, Request, SubmitRequestOwnError } from "../models/structures";

class RequestControllerService {
  async getRequestByIndex(client: ClientUser, index: number): Promise<Request> {
    const request = await client.requests.findByIndex(index);
    if (!request) {
      throw new EndpointError.RequestNotFoundError({ index });
    }
    return request;
  }
}

export class RequestController extends Controller implements RequestEndpointResponder {
  private readonly service = new RequestControllerService();

  async accept(clientDiscordId: string, params: Endpoint.AcceptParams): Promise<Endpoint.AcceptResult> {
    const client = await this.getClientUser(clientDiscordId);
    const request = await this.service.getRequestByIndex(client, params.index);

    let profile;
    try {
      profile = await request.accept();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new EndpointError.RequestNotFoundError({ index: params.index });
      }
      throw error;
    }

    return this.convertProfileToResult(profile);
  }

  async cancel(clientDiscordId: string, params: Endpoint.CancelParams): Promise<Endpoint.CancelResult> {
    const client = await this.getClientUser(clientDiscordId);
    const request = await this.service.getRequestByIndex(client, params.index);

    try {
      await request.cancel();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new EndpointError.RequestNotFoundError({ index: params.index });
      }
      throw error;
    }

    return this.convertRequestToResult(request);
  }

  async create(clientDiscordId: string, params: Endpoint.CreateParams): Promise<Endpoint.CreateResult> {
    const client = await this.getClientUser(clientDiscordId);
    const target = await this.getUser(client, params.targetDiscordId);

    let request;
    try {
      request = await target.submitRequest(params.content);
    } catch (error) {
      if (error instanceof ContentLengthLimitError) {
        throw new EndpointError.ContentLengthLimitError(error.min, error.max, error.actual);
      } else if (error instanceof SubmitRequestOwnError) {
        throw new EndpointError.SendRequestOwnError({ discordId: params.targetDiscordId });
      }
      throw error;
    }

    return this.convertRequestToResult(request);
  }

  async deny(clientDiscordId: string, params: Endpoint.DenyParams): Promise<Endpoint.DenyResult> {
    const client = await this.getClientUser(clientDiscordId);
    const request = await this.service.getRequestByIndex(client, params.index);

    try {
      await request.deny();
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new EndpointError.RequestNotFoundError({ index: params.index });
      }
      throw error;
    }

    return this.convertRequestToResult(request);
  }

  async find(clientDiscordId: string, params: Endpoint.FindParams): Promise<Endpoint.FindResult> {
    const client = await this.getClientUser(clientDiscordId);
    const request = await this.service.getRequestByIndex(client, params.index);

    return this.convertRequestToResult(request);
  }

  async search(clientDiscordId: string, params: Endpoint.SearchParams): Promise<Endpoint.SearchResult> {
    const client = await this.getClientUser(clientDiscordId);

    const requests = await client.asUser().searchRequests({
      order: params.order,
      start: (params.page - 1) * 5,
      count: 5,
      content: params.content,
      status: params.status,
      target: await this.getUserIfHasValue(client, params.targetDiscordId),
      applicant: await this.getUserIfHasValue(client, params.applicantDiscordId)
    });

    return requests.map((request) => this.convertRequestToResult(request));
  }
}
