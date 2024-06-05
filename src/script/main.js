const { open: openFile } = window.__TAURI__.dialog;
const { open: openLink } = window.__TAURI__.shell;

import { openDocument, currentFilePath} from "./modules/utils.js";
import * as Keys from "./modules/keys.js";
import "./modules/settings.js";

let fileBtn = document.querySelector("button");
let openBtn = document.getElementById("open-editor");

document.addEventListener("keydown", Keys.onPress)
document.addEventListener("keyup", Keys.onRelease)

openBtn.addEventListener("click", async()=>{
  console.log(currentFilePath);
  await openLink(currentFilePath);
});

fileBtn.addEventListener("click", async ()=>{

  let filePath =  await openFile({
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
