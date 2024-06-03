const { open } = window.__TAURI__.dialog;
const { Command } = window.__TAURI__.shell;
const {join, downloadDir, sep} = window.__TAURI__.path;
const { invoke } = window.__TAURI__.tauri;

import * as Keys from "./keys.js"
import { fileDiv } from "./slide.js"
import * as Slide from "./slide.js"

var currentZoom = 30;
let currentFilePath; 

var filePathSpan = document.getElementById("selectedFile");
let reloadBtn = document.getElementById("reload");

reloadBtn.addEventListener("click", reloadFile)

function reloadFile(){
  openDocument(currentFilePath);
}

function resetKeyListeners(){
  document.removeEventListener("keydown", Keys.onPress)
  document.removeEventListener("keyup", Keys.onRelease)
  document.addEventListener("keydown", Keys.onPress)
  document.addEventListener("keyup", Keys.onRelease)
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

function getWindowHeight(){
  return  window.innerHeight || document.documentElement.clientHeight;
}

// zoom (optional argument) := setZoom(zoom)
function fontZoom(zoom=0){
  zoom = zoom == 0 ? parseInt(window.getComputedStyle(fileDiv).fontSize)+1 : zoom;
  currentZoom = zoom;
  fileDiv.style.fontSize = `${zoom}px`;
}

function fontUnzoom(){
  fileDiv.style.fontSize = `${--currentZoom}px`;
}
export { getWindowHeight, fontZoom, fontUnzoom, currentZoom, importFromDocx, openDocument, reloadFile, currentFilePath}
