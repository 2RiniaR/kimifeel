import "./helpers";
import "./firebase";
import { clientManager } from "./discord";
import { settingsManager } from "./settings";
import "./define-actions";

console.log("Kimifeel started!");
settingsManager.load();
void clientManager.initialize();
