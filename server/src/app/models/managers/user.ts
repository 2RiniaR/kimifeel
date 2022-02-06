import { User } from "../structures";
import { ContextModel } from "../context";
import { withHandleRepositoryErrors } from "../errors";
import { UserRepository, UserUniqueField } from "../../../prisma";

export class UserManager extends ContextModel {
  private readonly service = new UserManagerService(this.context);

  public async find(unique: UserUniqueField): Promise<User | undefined> {
    return await this.service.find(unique);
  }

  public async findMany(uniques: UserUniqueField[]): Promise<User[]> {
    return await this.service.findMany(uniques);
  }
}

export class UserManagerService extends ContextModel {
  public async find(unique: UserUniqueField): Promise<User | undefined> {
    const result = await withHandleRepositoryErrors(() => new UserRepository().find(unique));
    if (!result) return;
    return User.fromRaw(this.context, result);
  }

  public async findMany(uniques: UserUniqueField[]): Promise<User[]> {
    const results = await withHandleRepositoryErrors(() => new UserRepository().findMany(uniques));
    return results.map((result) => User.fromRaw(this.context, result));
  }
}
