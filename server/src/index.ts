console.log("Kimifeel started?");
import "./helpers";
import "./prisma";
import { clientManager } from "./discord";
import { settingsManager } from "./settings";
import "./build";

console.log("Kimifeel started!");
settingsManager.load();
void clientManager.initialize();
