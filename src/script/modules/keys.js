import { nextSlide, previousSlide } from "./slide.js";
import { nextSpoiler, previousSpoiler } from "./spoiler.js";
import { fontUnzoom, fontZoom } from "./utils.js";

let currentKeyEl = document.getElementById("current-keys");

// using snake_case syntax
let keyBindings = {
  "next_spoiler": ["ArrowRight", "PageDown"],
  "previous_spoiler": ["ArrowLeft", "PageUp"],
  "next_slide": ["n"],
  "previous_slide": ["p"],
  "font_zoom": ["z"],
  "font_unzoom": ["Z"]
}

let keyMap = [];

function resolve_key_action(action){
  switch(action){
    case "next_spoiler":
      nextSpoiler();
      break;
    case "previous_spoiler":
      previousSpoiler();
      break;
    case "next_slide":
      nextSlide();
      break;
    case "previous_slide":
      previousSlide();
      break;
    case "font_zoom":
      fontZoom();
      break;
    case "font_unzoom":
      fontUnzoom();
      break;
  }
  return
}

// event is passed to preventDefault for keys like PageUp/Down
function handle_key_bindings(e=undefined){
  // go through each action bindings
  for(let action of Object.keys(keyBindings)){
    // go through each key making the action
    for(let mappedKey of keyBindings[action]){
      // resolve action if correct key is inputed
      if(keyMap.includes(mappedKey)){
        if (e!=undefined && mappedKey == e.key) e.preventDefault();
        resolve_key_action(action); 
      }
    }
  }
  return;
}

function onPress(e){
  // prevent pushing multiple times to array
  if (e.repeat) return;

  keyMap.push(e.key);
  handle_key_bindings(e);
  show_keys();
  return;
}

function onRelease(e){
  keyMap.splice(keyMap.indexOf(e.key));
  show_keys();
  handle_key_bindings();
  return;
}

// show current key map
function show_keys(){

  // clear the elem
  while (currentKeyEl.hasChildNodes()){
    currentKeyEl.removeChild(currentKeyEl.childNodes[0])
  }

  // fill it with current keys from keyMap
  for(let keyIdx in keyMap){
    let keyEl = document.createElement("kbd");
    keyEl.innerHTML = keyMap[keyIdx];

    currentKeyEl.appendChild(keyEl);
    currentKeyEl.innerHTML += keyIdx == keyMap.length-1 ? "" : "+";
  }
  return;
}

export {onPress, onRelease}
