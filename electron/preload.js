const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("windowControls", {
  minimise: () => ipcRenderer.send("minimise"),
  maximise: () => ipcRenderer.send("maximise"),
  close: () => ipcRenderer.send("close")
});