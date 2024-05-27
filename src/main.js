const { invoke } = window.__TAURI__.tauri;
const { open } = window.__TAURI__.dialog;


var fileBtn = document.querySelector("button");
var fileDiv = document.getElementById("file");
var filePathSpan = document.getElementById("selectedFile");
let slideSpan = document.getElementById("slideCounter");

// settings
let settingBtn = document.getElementById("settings-button");
let settingWindow = document.getElementById("settings-window");
let closeSettingsButton = document.getElementById("close-settings");
let editBtn = document.getElementById("edit-button");

let default_zoom = 30;

// store the spoilers in arrays like [html element, isVisible, Value]
var spoilers;
var currentSpoilerIndex = -1;

// store the current document and each slides
var slideList;
var slideIndex;

function getWindowHeight(){
  return  window.innerHeight || document.documentElement.clientHeight;
}

class Spoiler{

  constructor (htmlEl, isVisible, childs){
    this.htmlElement = htmlEl;
    this.isVisible = isVisible;
    this.value = childs;
  }

  isInViewport(){
    let rect = this.htmlElement.getBoundingClientRect();
    let height = getWindowHeight();

    if (rect.bottom <= 0 || rect.bottom > height){ return false; }
    return true;
  }

  show(){

    //console.debug("#Spoiler [show]: ", this);

    // clearing the text
    this.htmlElement.innerText = "";

    if (Array.isArray(this.value)){
    // re-adding the text with its decoration
      if (this.value.length > 0){
        for ( let i=0; i<this.value.length; i++){
          this.htmlElement.appendChild(this.value[i]);
          //console.debug(this.value[i]);
        }
      } 
    }
    else {
      this.htmlElement.innerText = this.value;
    }

    this.isVisible = true;
  }

  getClasses(){ return this.htmlElement.classList}
  hasClass(class_name){ return this.getClasses().contains(class_name) }

  hide(){
    
    let replaceSymbol = this.hasClass("underscore") ? "_" : "..";
    let skipChars = [];
    if (!this.hasClass("no-space")) skipChars.push(" ");
    this.htmlElement.innerText = textToSpoilerText(this.htmlElement.innerText, replaceSymbol, skipChars);
    
    this.isVisible = false;
  }
}

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
  
  slideList = await invoke("md_parsing", {"filePath": filePath});

  slideIndex = 0;
  setToCurrentSlide(slideList[slideIndex]);

  resetKeyListeners();
});

/* take raw html string as argument and display it in the fileDiv */
function setToCurrentSlide(strHtml){
  // init at first slide
  let htmlDoc = new DOMParser().parseFromString(strHtml, "text/html");

  let parsedMD = htmlDoc.querySelector("body");
  // clear area
  fileDiv.removeChild(fileDiv.firstChild);

  // update area to the compiled html
  fileDiv.appendChild(parsedMD);

  // reset currentSopoilerIndex & slideIndex
  currentSpoilerIndex = -1;

  initSpoilers();
  updateSlideCounter();
  fontZoom(25);
}

function resetKeyListeners(){
  document.removeEventListener("keydown", keyDownEvent)
  //document.removeEventListener("keyup", keyReleasedEvent)
  document.addEventListener("keydown", keyDownEvent)
  //document.addEventListener("keyup", keyReleasedEvent)
}

function initSpoilers(){
  //console.debug("#initSpoilers");
  // update spoilers
  spoilers = getSpoilers();
  // hide elements
  for (let spoiler of spoilers){
    spoiler.hide();
    spoiler.htmlElement.addEventListener("click", (e) => switchSpoilerState(e.target));
  }
  
}

function switchSpoilerState(elem){
  let spoiler = spoilers[elem.spoilerIndex]; 
  let spoilerState = spoiler.isVisible;

  if (spoilerState == true){
    spoiler.hide();
  } else if (spoilerState == false){
    spoiler.show();
  }

}

function getSpoilers(){

  //console.debug("#getSpoiler");
  let result = [];

  // get every spoilers elements
  let spoilerEl = document.querySelectorAll(".spoiler");
  let i = 0;

  spoilerEl.forEach(element => {
    // used in switchSpoilerState
    element.spoilerIndex = i;
    let value = Array.from(element.childNodes).length == 0 ? element.innerText : Array.from(element.childNodes); 
    //console.debug("\t", value);
    result.push(new Spoiler(element, false , value));
    i++;
  });

  return result;
}


function textToSpoilerText(text, replace, skipList){
  let result = ""; 
  for (let char of text){
    if (! skipList.includes(char)){
      result = result.concat(replace);
    } else {
      result = result.concat(char);
    }
  }
  return result;
}

// key handling :
// -> : show next spoiler
// <- : hide current spoiler
//var keyDate = 0;

function keyDownEvent(e){
  //console.log(e.code);

  //if (keyDate != 0 ) return;

  if ( e.code == "ArrowLeft" || e.code == "PageUp") {
    e.preventDefault(); // prevent PageUp going all the way up
    previousSpoiler();
    //keyDate = new Date();
  } else if (e.code == "ArrowRight" || e.code == "PageDown" ) {
    e.preventDefault(); // prevent PageDown going all the way Down 
    nextSpoiler();
    //keyDate = new Date();
  } else if (e.code == "KeyB" || e.code == "KeyN"){
    nextSlide();
  } else if (e.code == "F5" || e.code == "Escape" || e.code == "KeyP"){
    previousSlide();
  }
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

function nextSpoiler(){
  // check if there is another spoiler
  if ( currentSpoilerIndex < spoilers.length-1 ){ 
    let spoiler = spoilers[currentSpoilerIndex+1]; 
    if ( spoiler.isInViewport() ){
      currentSpoilerIndex++;
      spoiler.show();
      return;
    }
  }
  // scroll if there is no next spoiler or if it is not in viewport
  scrollBy(0, getWindowHeight()*0.7)
}

function previousSpoiler(){
  // check if there is a spoiler before
  if ( currentSpoilerIndex > -1 ) {

    let spoiler = spoilers[currentSpoilerIndex];

    if ( spoiler.isInViewport() ){
      spoiler.hide();
      currentSpoilerIndex--;
      return;
    }
  }
  // scroll if there is no next spoiler or if it is not in viewport
  scrollBy(0, -getWindowHeight()*0.7)
}

function updateSlideCounter(){
  slideSpan.innerText = `${slideIndex+1}/${slideList.length}` 
}

function nextSlide(){
  // check if there is a slide after the current one
  if ( slideIndex < slideList.length-1){
    setToCurrentSlide(slideList[++slideIndex])
    updateSlideCounter();
  }

  // scroll to top
  scrollTo(0,0);
  return;
}

function previousSlide(){
  // check if there is a slide after the current one
  if ( slideIndex > 0){
    setToCurrentSlide(slideList[--slideIndex])
    updateSlideCounter();
  }

  // scroll to top
  scrollTo(0,0);
  return;

}

document.getElementById("zoom-in").addEventListener("click", ()=>fontZoom());
document.getElementById("zoom-out").addEventListener("click", ()=>fontUnzoom());

function fontZoom(zoom=0){
  zoom = zoom == 0 ? parseInt(window.getComputedStyle(fileDiv).fontSize) : zoom;
  fileDiv.style.fontSize = `${zoom+1}px`;
}

function fontUnzoom(){
  let currentSize = parseInt(window.getComputedStyle(fileDiv).fontSize);
  fileDiv.style.fontSize = `${currentSize-1}px`;
}

