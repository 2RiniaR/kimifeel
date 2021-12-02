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
      name: "show-received-request",
      description: "届いているリクエストを表示する",
      options: [
        {
          type: 1,
          name: "latest",
          description: "届いているリクエストを、新しいものから表示する",
          options: [
            {
              type: 4,
              name: "page",
              description: "表示するページ（指定がない場合は1ページ目）",
              required: false
            }
          ]
        },
        {
          type: 1,
          name: "oldest",
          description: "届いているリクエストを、古いものから表示する",
          options: [
            {
              type: 4,
              name: "page",
              description: "表示するページ（指定がない場合は1ページ目）",
              required: false
            }
          ]
        },
        {
          type: 1,
          name: "number",
          description: "届いているリクエストを、番号を指定して表示する",
          options: [
            {
              type: 4,
              name: "number",
              description: "表示するリクエストの番号",
              required: true
            }
          ]
        }
      ]
    },

    {
      name: "show-sent-request",
      description: "送信済みのリクエストを表示する",
      options: [
        {
          type: 1,
          name: "latest",
          description: "送信済みのリクエストを、新しいものから表示する",
          options: [
            {
              type: 4,
              name: "page",
              description: "表示するページ（指定がない場合は1ページ目）",
              required: false
            }
          ]
        },
        {
          type: 1,
          name: "oldest",
          description: "送信済みのリクエストを、古いものから表示する",
          options: [
            {
              type: 4,
              name: "page",
              description: "表示するページ（指定がない場合は1ページ目）",
              required: false
            }
          ]
        },
        {
          type: 1,
          name: "number",
          description: "送信済みのリクエストを、番号を指定して表示する",
          options: [
            {
              type: 4,
              name: "number",
              description: "表示するリクエストの番号",
              required: true
            }
          ]
        }
      ]
    },

    {
      name: "show-profile",
      description: "プロフィールを表示する",
      options: [
        {
          type: 2,
          name: "user",
          description: "指定したユーザーのプロフィールを表示する",
          options: [
            {
              type: 1,
              name: "random",
              description: "指定したユーザーのプロフィールを、ランダムに表示する",
              options: [
                {
                  type: 6,
                  name: "target",
                  description: "ユーザー",
                  required: true
                },
                {
                  type: 6,
                  name: "author",
                  description: "記述者",
                  required: false
                },
                {
                  type: 3,
                  name: "content",
                  description: "含む文字列",
                  required: false
                }
              ]
            },

            {
              type: 1,
              name: "oldest",
              description: "指定したユーザーのプロフィールを、古いものから表示する",
              options: [
                {
                  type: 6,
                  name: "target",
                  description: "ユーザー",
                  required: true
                },
                {
                  type: 4,
                  name: "page",
                  description: "表示するページ（指定がない場合は1ページ目）",
                  required: false
                },
                {
                  type: 6,
                  name: "author",
                  description: "記述者",
                  required: false
                },
                {
                  type: 3,
                  name: "content",
                  description: "含む文字列",
                  required: false
                }
              ]
            },

            {
              type: 1,
              name: "latest",
              description: "指定したユーザーのプロフィールを、新しいものから表示する",
              options: [
                {
                  type: 6,
                  name: "target",
                  description: "ユーザー",
                  required: true
                },
                {
                  type: 4,
                  name: "page",
                  description: "表示するページ（指定がない場合は1ページ目）",
                  required: false
                },
                {
                  type: 6,
                  name: "author",
                  description: "記述者",
                  required: false
                },
                {
                  type: 3,
                  name: "content",
                  description: "含む文字列",
                  required: false
                }
              ]
            },

            {
              type: 1,
              name: "number",
              description: "指定したユーザーのプロフィールを、番号を指定して表示する",
              options: [
                {
                  type: 6,
                  name: "target",
                  description: "ユーザー",
                  required: true
                },
                {
                  type: 4,
                  name: "number",
                  description: "表示する番号",
                  required: true
                }
              ]
            }
          ]
        },
        {
          type: 2,
          name: "global",
          description: "すべてのユーザーのプロフィールを表示する",
          options: [
            {
              type: 1,
              name: "random",
              description: "すべてのユーザーのプロフィールを、ランダムに表示する",
              options: [
                {
                  type: 6,
                  name: "author",
                  description: "記述者",
                  required: false
                },
                {
                  type: 3,
                  name: "content",
                  description: "含む文字列",
                  required: false
                }
              ]
            },

            {
              type: 1,
              name: "oldest",
              description: "すべてのユーザーのプロフィールを、古いものから表示する",
              options: [
                {
                  type: 4,
                  name: "page",
                  description: "表示するページ（指定がない場合は1ページ目）",
                  required: false
                },
                {
                  type: 6,
                  name: "author",
                  description: "記述者",
                  required: false
                },
                {
                  type: 3,
                  name: "content",
                  description: "含む文字列",
                  required: false
                }
              ]
            },

            {
              type: 1,
              name: "latest",
              description: "すべてのユーザーのプロフィールを、新しいものから表示する",
              options: [
                {
                  type: 4,
                  name: "page",
                  description: "表示するページ（指定がない場合は1ページ目）",
                  required: false
                },
                {
                  type: 6,
                  name: "author",
                  description: "記述者",
                  required: false
                },
                {
                  type: 3,
                  name: "content",
                  description: "含む文字列",
                  required: false
                }
              ]
            }
          ]
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
