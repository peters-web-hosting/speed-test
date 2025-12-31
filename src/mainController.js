// src/mainController.js
// Entry point: orchestrates app logic and imports
import { setupForm } from "./formHandler.js";
import { setupHistory } from "./history.js";
import { renderInitialUI } from "./render.js";

renderInitialUI();
setupForm();
setupHistory();
