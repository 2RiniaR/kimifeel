import { UserRepository, UserUniqueField } from "data-store";
import { User } from "./user";
import { Context, ContextModel } from "./context";
import { withConvertRepositoryErrors } from "./errors";

export class UserFinder implements ContextModel {
  private readonly service: UserFinderService;

  public constructor(public readonly context: Context) {
    this.service = new UserFinderService(this.context);
  }

  public async find(unique: UserUniqueField): Promise<User | undefined> {
    return await this.service.find(unique);
  }

  public async findMany(uniques: UserUniqueField[]): Promise<User[]> {
    return await this.service.findMany(uniques);
  }
}

export class UserFinderService implements ContextModel {
  public constructor(public readonly context: Context) {}

  public async find(unique: UserUniqueField): Promise<User | undefined> {
    const result = await withConvertRepositoryErrors.invokeAsync(() => new UserRepository().find(unique));
    if (result === undefined) return;
    return User.fromRaw(this.context, result);
  }

  public async findMany(uniques: UserUniqueField[]): Promise<User[]> {
    const results = await withConvertRepositoryErrors.invokeAsync(() => new UserRepository().findMany(uniques));
    return results.map((result) => User.fromRaw(this.context, result));
  }
}
