import { Profile } from "../structures/profile";
import { ContextModel } from "../context";

export class ProfileService extends ContextModel {
  public async getByIndex(index: number): Promise<Profile | null> {
    return await this.repositories.profiles.getByIndex(this.context, index);
  }
}
