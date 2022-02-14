import * as dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { commands } from "./commands";

dotenv.config();
const token = getEnvironmentVariable("DISCORD_TOKEN");
const clientId = getEnvironmentVariable("CLIENT_ID");
const guildId = getEnvironmentVariable("TARGET_GUILD_ID");
const isGlobal = getEnvironmentVariable("COMMAND_SITE") === "GLOBAL";
const rest = new REST({ version: "9" }).setToken(token);

function getEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) return "";
  return value;
}

void (async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    if (isGlobal) {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    }

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(JSON.stringify(error));
  }
})();
