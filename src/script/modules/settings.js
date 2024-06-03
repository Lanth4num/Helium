const { invoke } = window.__TAURI__.tauri;
import { importFromDocx, fontZoom, currentZoom } from "./utils.js"

// Elements
let reportBtn = document.getElementById("report-bug");
let settingWindow = document.getElementById("settings-window");
let closeSettingsButton = document.getElementById("close-settings");
let importDocument = document.getElementById("import");
let editBtn = document.getElementById("edit-button");
let settingBtn = document.getElementById("settings-button");
let confirmSettingBtn = document.getElementById("confirm-settings");
let fontSizeInput = document.getElementById("font-size");
let fontFamilyInput =  document.getElementById("font-family");

closeSettingsButton.addEventListener("click", closeSettings);
importDocument.addEventListener("click", importFromDocx);
settingBtn.addEventListener("click", openSettings)
confirmSettingBtn.addEventListener("click", saveSettings);

let defaultFontFamily;

function saveSettings(){
  fontZoom(fontSizeInput.value);
  let mdbody = document.getElementsByClassName("markdown-body")[0];

  // get default font family (called once)
  if (defaultFontFamily == undefined){
    defaultFontFamily = window.getComputedStyle(mdbody).getPropertyValue("font-family");
  }

  // change font if needed
  let fFamily = fontFamilyInput.value; 
  if ( fFamily != "default"){
    mdbody.style.fontFamily = fFamily;
  }
  // handle default font
  else {mdbody.style.fontFamily = defaultFontFamily}
}

function openSettings(){
  settingWindow.style.setProperty("visibility", "visible");

  // set fontSize input to display current zoom
  fontSizeInput.value = currentZoom;
}

reportBtn.addEventListener("click", async ()=>{
  await invoke("open_link", {"link": "https://github.com/Lanth4num/Helium/issues"})
});

editBtn.addEventListener("click", async ()=>{
  await invoke("open_link", {"link": "https://dillinger.io/"})
});

function closeSettings(){
  settingWindow.style.setProperty("visibility", "hidden");
}
