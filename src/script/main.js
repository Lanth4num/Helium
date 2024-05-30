const { invoke } = window.__TAURI__.tauri;
const { shell } = window.__TAURI__.shell;
const { open } = window.__TAURI__.dialog;

import { nextSpoiler, previousSpoiler } from "./modules/spoiler.js";
import * as Slide from "./modules/slide.js";
import * as Keys from "./modules/keys.js";

var fileBtn = document.querySelector("button");
var filePathSpan = document.getElementById("selectedFile");

// settings
let settingBtn = document.getElementById("settings-button");
let settingWindow = document.getElementById("settings-window");
let closeSettingsButton = document.getElementById("close-settings");
let editBtn = document.getElementById("edit-button");

settingBtn.addEventListener("click", openSettings)
closeSettingsButton.addEventListener("click", closeSettings);

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

  filePathSpan.innerText = filePath;
  let request = await invoke("md_parsing", {"filePath": filePath});
  Slide.setSlideList(request);

  Slide.setSlideIndex(0);
  Slide.setToCurrentSlide(Slide.slideList[Slide.slideIndex]);
  resetKeyListeners();
});

function resetKeyListeners(){
  document.removeEventListener("keydown", keyDownEvent)
  document.removeEventListener("keyup", Keys.onRelease)
  document.addEventListener("keydown", keyDownEvent)
  document.addEventListener("keyup", Keys.onRelease)
}

// key handling :
// -> : show next spoiler
// <- : hide current spoiler
//var keyDate = 0;

function keyDownEvent(e){
  //if (keyDate != 0 ) return;
  Keys.onPress(e);
  /*
  if ( e.code == "ArrowLeft" || e.code == "PageUp") {
    e.preventDefault(); // prevent PageUp going all the way up
    previousSpoiler();
    //keyDate = new Date();
  } else if (e.code == "ArrowRight" || e.code == "PageDown" ) {
    e.preventDefault(); // prevent PageDown going all the way Down 
    nextSpoiler();
    //keyDate = new Date();
  } else if (e.code == "KeyB" || e.code == "KeyN"){
    Slide.nextSlide();
  } else if (e.code == "F5" || e.code == "Escape" || e.code == "KeyP"){
    Slide.previousSlide();
  }
  */
}

/*
function keyReleasedEvent(e){
  if (keyDate == 0) return;
  let timePressed = (new Date().getTime() - keyDate.getTime())
  keyDate = 0;
  // call next slide on long press (> 500 ms)
  if (timePressed < 500) return;

  switch( e.code ){
    case "ArrowRight":
      nextSlide();
      break;
    case "ArrowLeft":
      previousSlide();
      break;
  }
}
*/

document.getElementById("zoom-in").addEventListener("click", ()=>fontZoom());
document.getElementById("zoom-out").addEventListener("click", ()=>fontUnzoom());
