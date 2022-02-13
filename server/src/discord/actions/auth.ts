import * as Auth from "auth";
import { Communicator } from "./communicator";
import { withConvertAuthErrors } from "./errors";

export async function authorize(endpoint: Auth.AuthEndpoint, communicator: Communicator): Promise<Auth.ClientBody> {
  return await withConvertAuthErrors.invoke(() => endpoint.authorize({ discordId: communicator.getSender().id }));
}
