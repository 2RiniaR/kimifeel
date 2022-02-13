import * as Endpoint from "app/endpoints";
import { ContentLengthLimitError, ForbiddenError, InvalidParameterError, SubmitRequestOwnError } from "app/models";
import { ClientUserService, ProfileService, RequestService, UserService } from "./services";
import { withConvertModelErrors } from "./errors";

export class RequestController implements Endpoint.RequestEndpoint {
  async accept(clientId: string, specifier: Endpoint.RequestSpecifier): Promise<Endpoint.ProfileBody> {
    const client = await new ClientUserService().getById(clientId);

    const profile = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof ForbiddenError) throw new Endpoint.RequestNotFoundError(specifier);
      })
      .invoke(async () => {
        const request = await new RequestService().find(client, specifier);
        return await request.accept();
      });

    return new ProfileService().toBody(profile);
  }

  async cancel(clientId: string, specifier: Endpoint.RequestSpecifier): Promise<Endpoint.RequestBody> {
    const client = await new ClientUserService().getById(clientId);
    const requestService = new RequestService();

    const request = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof ForbiddenError) throw new Endpoint.RequestNotFoundError(specifier);
      })
      .invoke(async () => {
        const request = await new RequestService().find(client, specifier);
        return await request.cancel();
      });

    return requestService.toBody(request);
  }

  async create(clientId: string, params: Endpoint.CreateRequestParams): Promise<Endpoint.RequestBody> {
    const client = await new ClientUserService().getById(clientId);

    const request = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof ContentLengthLimitError) {
          throw new Endpoint.ContentLengthLimitError(error.min, error.max, error.actual);
        }
        if (error instanceof SubmitRequestOwnError) throw new Endpoint.SentRequestOwnError();
      })
      .invoke(async () => {
        const target = await new UserService().find(client, params.target);
        return await target.submitRequest(params.content);
      });

    return new RequestService().toBody(request);
  }

  async deny(clientId: string, specifier: Endpoint.RequestSpecifier): Promise<Endpoint.RequestBody> {
    const client = await new ClientUserService().getById(clientId);
    const requestService = new RequestService();

    const request = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof ForbiddenError) throw new Endpoint.RequestNotFoundError(specifier);
      })
      .invoke(async () => {
        const request = await new RequestService().find(client, specifier);
        return await request.deny();
      });

    return requestService.toBody(request);
  }

  async find(clientId: string, specifier: Endpoint.RequestSpecifier): Promise<Endpoint.RequestBody> {
    const client = await new ClientUserService().getById(clientId);
    const requestService = new RequestService();
    const request = await withConvertModelErrors.invoke(() => requestService.find(client, specifier));
    return requestService.toBody(request);
  }

  async search(clientId: string, params: Endpoint.SearchRequestParams): Promise<Endpoint.RequestBody[]> {
    const resultPerPage = 5;
    const client = await new ClientUserService().getById(clientId);

    const userService = new UserService();
    const requests = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof InvalidParameterError && error.key === "start") {
          throw new Endpoint.ParameterFormatInvalidError<Endpoint.SearchRequestParams>("page", ">= 1");
        }
      })
      .invoke(async () =>
        client.asUser().searchRequests({
          order: params.order,
          start: (params.page - 1) * resultPerPage,
          count: resultPerPage,
          content: params.content,
          status: params.status,
          target: params.target ? await userService.find(client, params.target) : undefined,
          applicant: params.applicant ? await userService.find(client, params.applicant) : undefined
        })
      );

    const requestService = new RequestService();
    return requests.map((request) => requestService.toBody(request));
  }
}
