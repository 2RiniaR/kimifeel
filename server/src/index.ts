import "./helpers";
import "./firebase";
import { clientManager } from "./discord";
import { settingsManager } from "./settings";
import { buildApplication } from "./build";

console.log("Kimifeel started!");
settingsManager.load();
const bind = buildApplication();
void clientManager.initialize();
