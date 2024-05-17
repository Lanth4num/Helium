const { invoke } = window.__TAURI__.tauri;
const { open } = window.__TAURI__.dialog;


var fileBtn = document.querySelector("button");
var fileDiv = document.getElementById("file");
var span = document.getElementById("selectedFile");

// store the spoilers in arrays like [html element, isVisible, Value]
var spoilers;
var currentSpoilerIndex = -1;

class Spoiler{

  constructor (htmlEl, isVisible, value){
    this.htmlElement = htmlEl;
    this.isVisible = isVisible;
    this.value = value
  }

  isInViewport(){
    let rect = this.htmlElement.getBoundingClientRect();
    let height = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom <= 0 || rect.bottom > height){
      return false;
    }
    return true;
  }

  show(){

    console.debug("#Spoiler [show]: ", this);

    // clearing the text
    this.htmlElement.innerText = "";

    if (Array.isArray(this.value)){
    // re-adding the text with its decoration
      if (this.value.length > 0){
        for ( let i=0; i<this.value.length; i++){
          this.htmlElement.appendChild(this.value[i]);
          console.debug(this.value[i]);
        }
      } 
    }
    else {
      this.htmlElement.innerText = this.value;
    }

    this.isVisible = true;
  }

  hide(){
    console.debug("#Spoiler [hide]: ", this);

    this.htmlElement.innerText = textToSpoilerText(this.htmlElement.innerText);
    
    this.isVisible = false;
  }
}

fileBtn.addEventListener("click", async (e)=>{

  let filePath =  await open({
    multiple: false,
    title: "Select Markdown File",
    filters: [{
      name: "Markdown file",
      extensions: ['md']
    }]
  });

  span.innerText = filePath;
  
  let htmlText = await invoke("md_parsing", {"filePath": filePath});
  let htmlDoc = new DOMParser().parseFromString(htmlText, "text/html");

  let parsedMD = htmlDoc.querySelector("body");
  // clear area
  fileDiv.removeChild(fileDiv.firstChild);

  // update area to the compiled html
  fileDiv.appendChild(parsedMD);

  // reset currentSopoilerIndex
  currentSpoilerIndex = -1;

  initSpoilers();
});

function initSpoilers(){
  console.debug("#initSpoilers");
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

  console.debug("#getSpoiler");
  let result = [];

  // get every spoilers elements
  let spoilerEl = document.querySelectorAll(".spoiler");
  let i = 0;

  spoilerEl.forEach(element => {
    // used in switchSpoilerState
    element.spoilerIndex = i;
    let value = Array.from(element.childNodes).length == 0 ? element.innerText : Array.from(element.childNodes); 
    console.debug("\t", value);
    result.push(new Spoiler(element, false , value));
    i++;
  });

  return result;
}


function textToSpoilerText(text){
  let result = ""; 
  for (let char of text){
    if (char != " "){
      result = result.concat("..");
    } else {
      result = result.concat("  ");
    }
  }
  return result;
}

// key handling :
// -> : show next spoiler
// <- : hide current spoiler
// 
document.addEventListener("keydown", (e)=>{

  let windowHeight =  window.innerHeight || document.documentElement.clientHeight;

  if ( e.code == "ArrowRight" ) {
    if ( currentSpoilerIndex < spoilers.length-1 ){ 
      if ( spoilers[currentSpoilerIndex+1].isInViewport() ){
        currentSpoilerIndex++;
        spoilers[currentSpoilerIndex].show();
      } else {
        scrollBy(0, windowHeight*0.75)
      }
    }
    // Make it work even if there is no spoilers
    else {
        scrollBy(0, windowHeight*0.75)
    }

  } else if (e.code == "ArrowLeft" ) {

    if ( currentSpoilerIndex > -1 ) {
      let spoiler = spoilers[currentSpoilerIndex];

      if ( spoiler.isInViewport() ){
        spoiler.hide();
        currentSpoilerIndex--;
      } else {
        scrollBy(0, -windowHeight*0.7)
      }
    }
    // Make it work even if there is no spoilers
    else {
        scrollBy(0, -windowHeight*0.7)
    }
  }
});

document.getElementById("zoom-in").addEventListener("click", ()=>fontZoom());
document.getElementById("zoom-out").addEventListener("click", ()=>fontUnzoom());

function fontZoom(){
  let currentSize = parseInt(window.getComputedStyle(fileDiv).fontSize);
  fileDiv.style.fontSize = `${currentSize+1}px`;
}

function fontUnzoom(){
  let currentSize = parseInt(window.getComputedStyle(fileDiv).fontSize);
  fileDiv.style.fontSize = `${currentSize-1}px`;
}

