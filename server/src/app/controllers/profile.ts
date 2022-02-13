import * as Endpoint from "app/endpoints";
import { ContentLengthLimitError, ForbiddenError, InvalidParameterError } from "app/models";
import { ClientUserService, ProfileService, UserService } from "./services";
import { withConvertModelErrors } from "./errors";

export class ProfileController implements Endpoint.ProfileEndpoint {
  async create(clientId: string, { content }: Endpoint.CreateProfileParams): Promise<Endpoint.ProfileBody> {
    const client = await new ClientUserService().getById(clientId);

    const profile = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof ContentLengthLimitError) {
          throw new Endpoint.ContentLengthLimitError(error.min, error.max, error.actual);
        }
      })
      .invoke(() => client.asUser().createProfile(content));

    return new ProfileService().toBody(profile);
  }

  async delete(clientId: string, specifier: Endpoint.ProfileSpecifier): Promise<Endpoint.ProfileBody> {
    const client = await new ClientUserService().getById(clientId);
    const profileService = new ProfileService();

    const result = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof ForbiddenError) throw new Endpoint.ProfileNotFoundError(specifier);
      })
      .invoke(async () => {
        const profile = await profileService.find(client, specifier);
        return await profile.delete();
      });

    return profileService.toBody(result);
  }

  async find(clientId: string, specifier: Endpoint.ProfileSpecifier): Promise<Endpoint.ProfileBody> {
    const client = await new ClientUserService().getById(clientId);
    const profile = await withConvertModelErrors.invoke(() => new ProfileService().find(client, specifier));
    return new ProfileService().toBody(profile);
  }

  async random(clientId: string, params: Endpoint.ProfileCondition): Promise<Endpoint.ProfileBody[]> {
    const resultPerPage = 5;
    const client = await new ClientUserService().getById(clientId);

    const userService = new UserService();
    const profiles = await withConvertModelErrors.invoke(async () =>
      client.profiles.random({
        count: resultPerPage,
        content: params.content,
        author: params.author ? await userService.find(client, params.author) : undefined,
        owner: params.owner ? await userService.find(client, params.owner) : undefined
      })
    );

    const profileService = new ProfileService();
    return profiles.map((profile) => profileService.toBody(profile));
  }

  async search(clientId: string, params: Endpoint.SearchProfileParams): Promise<Endpoint.ProfileBody[]> {
    const resultPerPage = 5;
    const client = await new ClientUserService().getById(clientId);

    const userService = new UserService();
    const profiles = await withConvertModelErrors
      .guard((error) => {
        if (error instanceof InvalidParameterError && error.key === "start") {
          throw new Endpoint.ParameterFormatInvalidError<Endpoint.SearchProfileParams>("page", ">= 1");
        }
      })
      .invoke(async () =>
        client.profiles.search({
          order: params.order,
          start: (params.page - 1) * resultPerPage,
          count: resultPerPage,
          content: params.content,
          author: params.author ? await userService.find(client, params.author) : undefined,
          owner: params.owner ? await userService.find(client, params.owner) : undefined
        })
      );

    const profileService = new ProfileService();
    return profiles.map((profile) => profileService.toBody(profile));
  }
}
