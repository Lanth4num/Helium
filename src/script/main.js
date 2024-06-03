const { open } = window.__TAURI__.dialog;

import { fontZoom, fontUnzoom, openDocument} from "./modules/utils.js";
import "./modules/settings.js";

var fileBtn = document.querySelector("button");

document.getElementById("zoom-in").addEventListener("click", ()=>fontZoom());
document.getElementById("zoom-out").addEventListener("click", ()=>fontUnzoom());

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
