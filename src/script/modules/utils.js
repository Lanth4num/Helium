import { fileDiv } from "./slide.js"

var default_zoom = 30;

function getWindowHeight(){
  return  window.innerHeight || document.documentElement.clientHeight;
}

function fontZoom(zoom=0){
  zoom = zoom == 0 ? parseInt(window.getComputedStyle(fileDiv).fontSize) : zoom;
  fileDiv.style.fontSize = `${zoom+1}px`;
}

function fontUnzoom(){
  let currentSize = parseInt(window.getComputedStyle(fileDiv).fontSize);
  fileDiv.style.fontSize = `${currentSize-1}px`;
}
export { getWindowHeight, fontZoom, fontUnzoom, default_zoom }
