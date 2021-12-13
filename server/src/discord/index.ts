import { ClientManager } from "./client";
import { TargetGuildManager } from "./target-guild";

export const clientManager = new ClientManager();
export const targetGuildManager = new TargetGuildManager(clientManager.client);
