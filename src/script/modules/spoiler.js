import { getWindowHeight } from "./utils.js";

// store the spoilers in arrays like [html element, isVisible, Value]
var spoilers;
var currentSpoilerIndex = -1;

function setCurrentSpoilerIndex(value){
  if (typeof(value) != "number") return
  currentSpoilerIndex = value
}

function nextSpoiler(){
  if (spoilers == undefined){console.log("undefined spoilers");return;}
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

    // clearing the text
    this.htmlElement.innerText = "";

    if (Array.isArray(this.value)){
    // re-adding the text with its decoration
      if (this.value.length > 0){
        for ( let i=0; i<this.value.length; i++){
          this.htmlElement.appendChild(this.value[i]);
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
    if (!this.hasClass("no-space")){skipChars.push(" ")};
    this.htmlElement.innerText = textToSpoilerText(this.htmlElement.innerText, replaceSymbol, skipChars);
    
    this.isVisible = false;
  }

}

function initSpoilers(){
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

  let result = [];

  // get every spoilers elements
  let spoilerEl = document.querySelectorAll(".spoiler");
  let i = 0;

  spoilerEl.forEach(element => {
    // used in switchSpoilerState
    element.spoilerIndex = i;
    let value = Array.from(element.childNodes).length == 0 ? element.innerText : Array.from(element.childNodes); 
    result.push(new Spoiler(element, false , value));
    i++;
  });

  return result;
}

export { Spoiler, initSpoilers, getSpoilers, switchSpoilerState, nextSpoiler, previousSpoiler, setCurrentSpoilerIndex}
