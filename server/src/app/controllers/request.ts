import { RequestEndpointResponder } from "../endpoints/request";
import * as EndpointError from "../endpoints/errors";
import {
  ContentLengthLimitError,
  ForbiddenError,
  InvalidParameterError,
  SubmitRequestOwnError
} from "../models/errors";
import { ClientUserService, ProfileService, RequestService, UserService } from "./services";
import {
  CreateRequestParams,
  ProfileBody,
  RequestBody,
  RequestSpecifier,
  SearchRequestParams
} from "../endpoints/structures";
import { withHandleModelErrors } from "./errors";

export class RequestController implements RequestEndpointResponder {
  async accept(clientId: string, specifier: RequestSpecifier): Promise<ProfileBody> {
    const client = await new ClientUserService().getById(clientId);

    const profile = await withHandleModelErrors(async () => {
      const request = await new RequestService().find(client, specifier);
      try {
        return await request.accept();
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new EndpointError.RequestNotFoundError(specifier);
        }
        throw error;
      }
    });

    return new ProfileService().toBody(profile);
  }

  async cancel(clientId: string, specifier: RequestSpecifier): Promise<RequestBody> {
    const client = await new ClientUserService().getById(clientId);
    const requestService = new RequestService();

    const result = await withHandleModelErrors(async () => {
      const request = await requestService.find(client, specifier);
      try {
        return await request.cancel();
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new EndpointError.RequestNotFoundError(specifier);
        }
        throw error;
      }
    });

    return requestService.toBody(result);
  }

  async create(clientId: string, params: CreateRequestParams): Promise<RequestBody> {
    const client = await new ClientUserService().getById(clientId);

    const request = await withHandleModelErrors(async () => {
      const target = await new UserService().find(client, params.target);
      try {
        return await target.submitRequest(params.content);
      } catch (error) {
        if (error instanceof ContentLengthLimitError) {
          throw new EndpointError.ContentLengthLimitError(error.min, error.max, error.actual);
        }
        if (error instanceof SubmitRequestOwnError) {
          throw new EndpointError.SendRequestOwnError();
        }
        throw error;
      }
    });

    return new RequestService().toBody(request);
  }

  async deny(clientId: string, specifier: RequestSpecifier): Promise<RequestBody> {
    const client = await new ClientUserService().getById(clientId);
    const requestService = new RequestService();

    const result = await withHandleModelErrors(async () => {
      const request = await requestService.find(client, specifier);
      try {
        return await request.deny();
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new EndpointError.RequestNotFoundError(specifier);
        }
        throw error;
      }
    });

    return requestService.toBody(result);
  }

  async find(clientId: string, specifier: RequestSpecifier): Promise<RequestBody> {
    const client = await new ClientUserService().getById(clientId);
    const requestService = new RequestService();
    const request = await withHandleModelErrors(() => requestService.find(client, specifier));
    return requestService.toBody(request);
  }

  async search(clientId: string, params: SearchRequestParams): Promise<RequestBody[]> {
    const resultPerPage = 5;
    const client = await new ClientUserService().getById(clientId);

    const userService = new UserService();
    const requests = await withHandleModelErrors(async () => {
      try {
        return client.asUser().searchRequests({
          order: params.order,
          start: (params.page - 1) * resultPerPage,
          count: resultPerPage,
          content: params.content,
          status: params.status,
          target: params.target ? await userService.find(client, params.target) : undefined,
          applicant: params.applicant ? await userService.find(client, params.applicant) : undefined
        });
      } catch (error) {
        if (error instanceof InvalidParameterError && error.key === "start") {
          throw new EndpointError.ParameterFormatInvalidError<SearchRequestParams>("page", ">= 1");
        }
        throw error;
      }
    });

    const requestService = new RequestService();
    return requests.map((request) => requestService.toBody(request));
  }
}
