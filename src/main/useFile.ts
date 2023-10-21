import fs from "node:fs";
import { ipcRenderer } from "electron";

ipcRenderer.on("save-file-invoke", (_event, ...args) => {
  console.log("[save-file-invoke - _event]:", _event);

  const content = "Some content!";

  fs.writeFile("./my_new_file2.txt", content, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
});
