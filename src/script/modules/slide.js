import { initSpoilers, setCurrentSpoilerIndex } from "./spoiler.js";
import { fontZoom, currentZoom} from "./utils.js";

let slideSpan = document.getElementById("slideCounter");
export var fileDiv = document.getElementById("file");

// store the current document and each slides
export var slideList;
export var slideIndex = 0;

export function setSlideList(value){
  slideList = value;
}

export function setSlideIndex(value){
  if (typeof(value) != "number") return;
  slideIndex = value
}

/* take raw html string as argument and display it in the fileDiv */
export function setToCurrentSlide(strHtml){
  // init at first slide
  let htmlDoc = new DOMParser().parseFromString(strHtml, "text/html");

  let parsedMD = htmlDoc.querySelector("body");
  // clear area
  fileDiv.removeChild(fileDiv.firstChild);

  // update area to the compiled html
  fileDiv.appendChild(parsedMD);

  // reset currentSopoilerIndex & slideIndex
  setCurrentSpoilerIndex(-1);

  initSpoilers();
  updateSlideCounter();
  fontZoom(currentZoom);
}

function updateSlideCounter(){
  slideSpan.innerText = `${slideIndex+1}/${slideList.length}` 
}

export function nextSlide(){
  // check if there is a slide after the current one
  if ( slideIndex < slideList.length-1){
    setToCurrentSlide(slideList[++slideIndex])
    updateSlideCounter();
  }

  // scroll to top
  scrollTo(0,0);
  return;
}

export function previousSlide(){
  // check if there is a slide after the current one
  if ( slideIndex > 0){
    setToCurrentSlide(slideList[--slideIndex])
    updateSlideCounter();
  }

  // scroll to top
  scrollTo(0,0);
  return;

}

