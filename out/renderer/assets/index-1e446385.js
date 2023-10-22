const { app, BrowserWindow } = require("electron");
const path = require("path");
const { ipcMain } = require("electron");
var mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    frame: false,
    darkTheme: true,
    minWidth: 500,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
      //devTools: false
    }
  });
  mainWindow.setResizable(true);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile("tanklevelapp.html");
  mainWindow.maximize();
  mainWindow.webContents.on("did-finish-load", function() {
    mainWindow.show();
  });
}
function createRecordWindow() {
  const win = new BrowserWindow({
    height: 1e3,
    width: 980,
    frame: false,
    darkTheme: true,
    webPreferences: {
      preload: path.join(__dirname, "record.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false
      //  devTools: false
    }
  });
  win.setResizable(false);
  win.setMenuBarVisibility(false);
  win.loadFile("record.html");
  return win;
}
ipcMain.on("openRecord", (event, arg) => {
  console.log("Open Record");
  recordWin = createRecordWindow();
  recordWin.webContents.send("forWin2", arg);
});
app.allowRendererProcessReuse = false;
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
app.on("window-all-closed", function() {
  if (process.platform !== "darwin")
    app.quit();
});
