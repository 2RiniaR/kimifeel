import { ContextModel } from "../context/context-model";
import { Profile } from "../structures/profile";

export class ProfileService extends ContextModel {
  public async getByIndex(index: number): Promise<Profile | null> {
    return await this.repositories.profiles.getByIndex(index);
  }
}
