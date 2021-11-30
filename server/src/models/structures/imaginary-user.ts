import { ImaginaryUserService } from "../services/user-service";

export class ImaginaryUser {
  private readonly service = new ImaginaryUserService(this);
  public readonly discordId: string;

  public constructor(props: CreateUserProps) {
    this.discordId = props.discordId;
  }

  public async createIfNotExist() {
    return await this.service.createIfNotExist();
  }
}

export type CreateUserProps = {
  discordId: string;
};
