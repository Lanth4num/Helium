const { invoke } = window.__TAURI__.tauri;
const { Command } = window.__TAURI__.shell;
const {join, downloadDir, sep} = window.__TAURI__.path;
const { open } = window.__TAURI__.dialog;

// import { nextSpoiler, previousSpoiler } from "./modules/spoiler.js";
import * as Slide from "./modules/slide.js";
import * as Keys from "./modules/keys.js";

var fileBtn = document.querySelector("button");
let reloadBtn = document.getElementById("reload");
var filePathSpan = document.getElementById("selectedFile");

// settings
let reportBtn = document.getElementById("report-bug");
let settingBtn = document.getElementById("settings-button");
let settingWindow = document.getElementById("settings-window");
let closeSettingsButton = document.getElementById("close-settings");
let importDocument = document.getElementById("import");
let editBtn = document.getElementById("edit-button");

let currentFilePath; 

reloadBtn.addEventListener("click", reloadFile)
settingBtn.addEventListener("click", openSettings)
closeSettingsButton.addEventListener("click", closeSettings);
importDocument.addEventListener("click", importFromDocx);
reportBtn.addEventListener("click", async ()=>{
  await invoke("open_link", {"link": "https://github.com/Lanth4num/Helium/issues"})
});


function reloadFile(){
  openDocument(currentFilePath);
}

async function openDocument(filePath){

  if (filePath == null){
    console.error("Null filePath");
    return;
  }
  currentFilePath = filePath;
  filePathSpan.innerText = filePath;
  let request = await invoke("md_parsing", {"filePath": filePath});
  Slide.setSlideList(request);

  Slide.setSlideIndex(0);
  Slide.setToCurrentSlide(Slide.slideList[Slide.slideIndex]);
  resetKeyListeners();
}

async function importFromDocx(){

  let filePath =  await open({
    multiple: false,
    title: "Select Docx File",
    filters: [{
      name: "Docx File",
      extensions: ['docx']
    }]
  });

  if (filePath == null) return;
  let fileName = filePath.split(sep);
  fileName = fileName[fileName.length-1].replace(".docx", ".md");

  const newFilePath = await join(await downloadDir(), fileName);

  if (newFilePath == null){
    console.error("Error with join()");
    return;
  }
  
  let args = [
    filePath,
    '-f',
    'docx',
    '-t',
    'markdown',
    '-o',
    newFilePath
  ];

  const command = new Command('pandoc', args);

  command.on("close", (d)=>{
    console.log(`finished with: ${JSON.stringify(d)}`);
    openDocument(newFilePath);
  });

  command.on("error", (e)=>{
    console.error(e);
  });

  command.on("stdout", (line)=>{
    console.log(`stdout: ${line}`);
  });

  command.on("stderr", (e)=>{
    console.error(`stderr: ${e}`);
  });

  await command.spawn();
  return;
}

function closeSettings(){
  settingWindow.style.setProperty("visibility", "hidden");
}

function openSettings(){
  settingWindow.style.setProperty("visibility", "visible");
}

editBtn.addEventListener("click", async ()=>{
  await invoke("open_link", {"link": "https://dillinger.io/"})
});

fileBtn.addEventListener("click", async ()=>{

  let filePath =  await open({
    multiple: false,
    title: "Select Markdown File",
    filters: [{
      name: "Markdown file",
      extensions: ['md']
    }]
  });

  if (filePath == null) return;
  openDocument(filePath);
});

function resetKeyListeners(){
  document.removeEventListener("keydown", Keys.onPress)
  document.removeEventListener("keyup", Keys.onRelease)
  document.addEventListener("keydown", Keys.onPress)
  document.addEventListener("keyup", Keys.onRelease)
}

document.getElementById("zoom-in").addEventListener("click", ()=>fontZoom());
document.getElementById("zoom-out").addEventListener("click", ()=>fontUnzoom());
