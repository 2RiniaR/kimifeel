import * as dotenv from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

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

function getCommands(): object[] {
  return [
    {
      name: "add-profile",
      description: "自分のプロフィールを追加する",
      options: [
        {
          type: 3,
          name: "content",
          description: "追加するプロフィールの内容",
          required: true
        }
      ]
    },
    {
      name: "delete-profile",
      description: "自分のプロフィールを削除する",
      options: [
        {
          type: 4,
          name: "number",
          description: "削除するプロフィールの番号",
          required: true
        }
      ]
    },
    {
      name: "show-profile",
      description: "ユーザーのプロフィールを表示する",
      options: [
        {
          type: 6,
          name: "target",
          description: "表示するユーザー",
          required: true
        }
      ]
    },
    {
      name: "request-profile",
      description: "プロフィールの追加をリクエストする",
      options: [
        {
          type: 6,
          name: "target",
          description: "プロフィールを追加する対象のユーザー",
          required: true
        },
        {
          type: 3,
          name: "content",
          description: "追加するプロフィールの内容",
          required: true
        }
      ]
    }
  ];
}

void (async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    if (isGlobal) {
      await rest.put(Routes.applicationCommands(clientId), { body: getCommands() });
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: getCommands() });
    }

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(JSON.stringify(error));
  }
})();
