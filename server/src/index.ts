import "./helpers";
import "./firebase";
import { clientManager } from "./discord";
import { settingsManager } from "./settings";
import "./build";

console.log("Kimifeel started!");
settingsManager.load();
void clientManager.initialize();
