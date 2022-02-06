import * as EndpointError from "../endpoints/errors";
import { ContentLengthLimitError, ForbiddenError, InvalidParameterError } from "../models/errors";
import { ClientUserService, ProfileService, UserService } from "./services";
import {
  CreateProfileParams,
  ProfileBody,
  ProfileCondition,
  ProfileSpecifier,
  SearchProfileParams
} from "../endpoints/structures";
import { ProfileEndpointResponder } from "../endpoints/profile";
import { withHandleModelErrors } from "./errors";

export class ProfileController implements ProfileEndpointResponder {
  async create(clientId: string, { content }: CreateProfileParams): Promise<ProfileBody> {
    const client = await new ClientUserService().getById(clientId);

    const profile = await withHandleModelErrors(() => {
      try {
        return client.asUser().createProfile(content);
      } catch (error) {
        if (error instanceof ContentLengthLimitError) {
          throw new EndpointError.ContentLengthLimitError(error.min, error.max, error.actual);
        }
        throw error;
      }
    });

    return new ProfileService().toBody(profile);
  }

  async delete(clientId: string, specifier: ProfileSpecifier): Promise<ProfileBody> {
    const client = await new ClientUserService().getById(clientId);
    const profileService = new ProfileService();

    const result = await withHandleModelErrors(async () => {
      try {
        const profile = await profileService.find(client, specifier);
        return await profile.delete();
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new EndpointError.ProfileNotFoundError(specifier);
        }
        throw error;
      }
    });

    return profileService.toBody(result);
  }

  async find(clientId: string, specifier: ProfileSpecifier): Promise<ProfileBody> {
    const client = await new ClientUserService().getById(clientId);
    const profile = await withHandleModelErrors(() => new ProfileService().find(client, specifier));
    return new ProfileService().toBody(profile);
  }

  async random(clientId: string, params: ProfileCondition): Promise<ProfileBody[]> {
    const resultPerPage = 5;
    const client = await new ClientUserService().getById(clientId);

    const userService = new UserService();
    const profiles = await withHandleModelErrors(async () =>
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

  async search(clientId: string, params: SearchProfileParams): Promise<ProfileBody[]> {
    const resultPerPage = 5;
    const client = await new ClientUserService().getById(clientId);

    const userService = new UserService();
    const profiles = await withHandleModelErrors(async () => {
      try {
        return await client.profiles.search({
          order: params.order,
          start: (params.page - 1) * resultPerPage,
          count: resultPerPage,
          content: params.content,
          author: params.author ? await userService.find(client, params.author) : undefined,
          owner: params.owner ? await userService.find(client, params.owner) : undefined
        });
      } catch (error) {
        if (error instanceof InvalidParameterError && error.key === "start") {
          throw new EndpointError.ParameterFormatInvalidError<SearchProfileParams>("page", ">= 1");
        }
        throw error;
      }
    });

    const profileService = new ProfileService();
    return profiles.map((profile) => profileService.toBody(profile));
  }
}
