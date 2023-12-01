const { app, BrowserWindow } = require("electron");
const path = require("path");
const ignoredNode = /node_modules|[/\\]\./;
const ignored1 = /database|[/\\]\./;
const { ipcMain } = require("electron");
const isDev = process.env.NODE_ENV === "development";
// hardwareid
const os = require("os");
const crypto = require("crypto");
const axios = require("axios");

const getHWIDs = async () => {
  try {
    // Make HTTP request to the provided URL
    const response = await axios.get(
      "https://raw.githubusercontent.com/miftachuda/hwid/main/list"
    );

    // Split the response data into a list based on newline characters
    const dataList = response.data.split("\n");

    // Print the resulting list
    console.log(dataList);
    return dataList;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return [];
  }
};
function getHardwareId() {
  const cpus = os.cpus();
  const networkInterfaces = os.networkInterfaces();

  const hardwareData = {
    cpus: cpus.map((cpu) => cpu.model),
    // networkInterfaces: Object.values(networkInterfaces).map((ni) =>
    //   ni.map((iface) => iface.mac)
    // ),
    totalMemory: os.totalmem(),
    platform: os.platform(),
    release: os.release(),
  };

  const hardwareString = JSON.stringify(hardwareData);

  // Use SHA-256 hash to generate a consistent and unique identifier
  const hardwareId = crypto
    .createHash("sha256")
    .update(hardwareString)
    .digest("hex");

  return hardwareId;
}

const myHardwareId = getHardwareId();
const hwids = getHWIDs();
console.log(myHardwareId);
// try {
//     require('electron-reloader')(__dirname, { ignored: [ignored1, ignoredNode] });
// } catch {

// }
var mainWindow;

async function gateCreateWindowWithLicense(createWindow) {
  const gateWindow = new BrowserWindow({
    resizable: false,
    frame: false,
    width: 420,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "../renderer/src/gate.js"),
      devTools: isDev,
    },
  });

  gateWindow.loadFile(path.join(__dirname, "../renderer/src/gate.html"));
  gateWindow.webContents.send("send-hwid", myHardwareId);
  if (isDev) {
    gateWindow.webContents.openDevTools({ mode: "detach" });
  }
  ipcMain.on("GATE_SUBMIT", async (_event, { key }) => {
    const listhwids = await hwids;
    if (listhwids.includes(myHardwareId)) {
      createWindow();
      gateWindow.close();
    }
    gateWindow.close();
  });
  // TODO(ezekg) Create main window for valid licenses
}

function createWindow() {
  //console.log("create")
  mainWindow = new BrowserWindow({
    frame: false,
    darkTheme: true,
    minWidth: 500,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      //devTools: false
    },
  });
  mainWindow.setResizable(true);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(
    path.join(__dirname, "../renderer/src/tanklevelapp.html")
  );
  mainWindow.maximize();
  mainWindow.webContents.on("did-finish-load", function () {
    mainWindow.show();
  });
}
function createRecordWindow() {
  const win = new BrowserWindow({
    height: 1000,
    width: 980,
    frame: false,
    darkTheme: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/record.js"),
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      //  devTools: false
    },
  });
  win.setResizable(false);
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, "../renderer/src/record.html"));
  return win;
}
ipcMain.on("openRecord", (event, arg) => {
  //console.log("Open Record");
  recordWin = createRecordWindow();
  recordWin.webContents.send("forWin2", arg);
});

app.allowRendererProcessReuse = false;
app.whenReady().then(() => {
  gateCreateWindowWithLicense(createWindow);
  // createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
