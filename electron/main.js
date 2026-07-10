const { app, BrowserWindow, ipcMain, protocol } = require("electron");
const path = require("path");
const { createHandler } = require("next-electron-rsc");

let mainWindow;

const dev = !app.isPackaged;

const { createInterceptor, localhostUrl } = createHandler({
  dir: path.join(
    app.getAppPath(),
    ".next",
    "standalone"
  ),
  protocol,
  debug: true
});

let stopIntercept;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    title: "futaba",
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, "icon", "futaba.ico")
  });

  //stopIntercept = await createInterceptor({ session: mainWindow.webContents.session });

  mainWindow.on('closed', () => {
    mainWindow = null;
    //stopIntercept?.();
  });

  await app.whenReady();

  await mainWindow.loadURL("http://localhost:3000");

  return;

  if (dev) {
    await mainWindow.loadURL("http://localhost:3000");
  } else {
    await mainWindow.loadURL(localhostUrl);
  }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform != "darwin") app.quit();
});

ipcMain.on("minimise", () => {
  mainWindow.minimize();
});

ipcMain.on("maximise", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("close", () => {
  mainWindow.close();
});
