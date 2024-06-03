const { invoke } = window.__TAURI__.tauri;

import { importFromDocx } from "./utils.js"

// settings
let reportBtn = document.getElementById("report-bug");
let settingWindow = document.getElementById("settings-window");
let closeSettingsButton = document.getElementById("close-settings");
let importDocument = document.getElementById("import");
let editBtn = document.getElementById("edit-button");
let settingBtn = document.getElementById("settings-button");

closeSettingsButton.addEventListener("click", closeSettings);
importDocument.addEventListener("click", importFromDocx);

settingBtn.addEventListener("click", openSettings)

reportBtn.addEventListener("click", async ()=>{
  await invoke("open_link", {"link": "https://github.com/Lanth4num/Helium/issues"})
});

editBtn.addEventListener("click", async ()=>{
  await invoke("open_link", {"link": "https://dillinger.io/"})
});

function closeSettings(){
  settingWindow.style.setProperty("visibility", "hidden");
}

function openSettings(){
  settingWindow.style.setProperty("visibility", "visible");
}

