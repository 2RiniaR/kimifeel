import "data-store";
import { ProfileController, RequestController, UserController } from "app";
import { AuthController } from "auth";
import { SettingsManager } from "settings";
import { DiscordBuilder } from "discord";

const settings = new SettingsManager();

const endpoints = {
  profile: new ProfileController(),
  request: new RequestController(),
  user: new UserController(),
  auth: new AuthController()
};

const discord = new DiscordBuilder(settings, endpoints);

settings.load();
discord.initialize();

console.log("Kimifeel started!");
