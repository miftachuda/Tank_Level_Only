const { app, BrowserWindow } = require("electron");
const { session } = require("electron");
const path = require("path");
const ignoredNode = /node_modules|[/\\]\./;
const ignored1 = /database|[/\\]\./;
const { ipcMain } = require("electron");
const remoteMain = require("@electron/remote/main");
remoteMain.initialize();
const isDev = process.env.NODE_ENV === "development";
// hardwareid
const os = require("os");
const crypto = require("crypto");
const axios = require("axios");
const pro_agent = require("proxying-agent").globalize(
  "http://miftachul.huda:pertamina%402026@172.17.3.162:8080"
);

const getHWIDs = async () => {
  var dataid = `cf7f5dfd5dce59743c6b866f4717adbc7273ecb8fde75076f9d931be649252ba
fe58ed442a8fcab2a27dd9840b811609466a04a5ee0d32424ebc30498fa632ad
8bf680c201dbb4e4ba5c5c9f4bc7eb7f33d0458c369e97fab99589f56a0aecc2
0f118142656599d5c263a3d52bac093fa1e202e839834e3f8148b1c65350fe36
cf7f5dfd5dce59743c6b866f4717adbc7273ecb8fde75076f9d931be649252ba
9f67923273737dc01c8be5290d33ff1efc8a095d5acbd66c5f1fc6c8433d5b98
b8be78994459697a34f24e38e94ea0fbc36a7a217e9fc74a59a63e610bb6e593
a80387e5cdfbcc0501bf34e8616d1b3f6bfae4482beac9cc56793a00a35182eb
36e08e4e8fc4da0406595e68d16d7384aee330f73f195834596c46b6c3338815
5d4e4179395cd37645a622bd5409865a058119314e763bcc8b2b8bc0c83fe353
d6752057628d17b53a6b2071528d8ba1af8c7c93dd854f5db52308e9c8adbaf2
45851f09abbaa00bf59bcbc8353ed00bca1f65062c972bea76461974bcf980c6`;
  var dataList = dataid.split("\n");
  return dataList;
  //   try {
  //     // Make HTTP request to the provided URL
  //     const response = await axios.get(
  //       "https://raw.githubusercontent.com/miftachuda/hwid/main/list"
  //     );

  //     // Split the response data into a list based on newline characters
  //     //const dataList = response.data.split("\n");
  //     // Print the resulting list
  //     console.log(dataList);
  //     return dataList;
  //   } catch (error) {
  //     console.error("Error fetching data:", error.message);
  //     return dataList;
  //   }
};
function getHardwareId() {
  const cpus = os.cpus();
  const macAddresses = [];
  const networkInterfaces = os.networkInterfaces();
  Object.keys(networkInterfaces).forEach((iface) => {
    networkInterfaces[iface].forEach((entry) => {
      if (entry.family === "IPv4" && !entry.internal) {
        macAddresses.push(entry.mac);
      }
    });
  });
  const hardwareData = {
    cpus: cpus.map((cpu) => cpu.model),
    // networkInterfaces: Object.values(networkInterfaces).map((ni) =>
    //   ni.map((iface) => iface.mac)
    // ),
    // mac: macAddresses,
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
// console.log(myHardwareId);
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
      devTools: false,
      webSecurity: false,
      //devTools: isDev,
    },
  });
  remoteMain.enable(gateWindow.webContents);
  gateWindow.loadFile(path.join(__dirname, "../renderer/src/gate.html"));
  gateWindow.webContents.send("send-hwid", myHardwareId);
  const listhwids = await hwids;
  if (isDev) {
    gateWindow.webContents.openDevTools({ mode: "detach" });
  }
  if (true) {
    createWindow();
    gateWindow.close();
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
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      //devTools: false
    },
  });
  remoteMain.enable(mainWindow.webContents);
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
  const recordWindow = new BrowserWindow({
    height: 1000,
    width: 980,
    frame: false,
    darkTheme: true,
    webPreferences: {
      preload: path.join(__dirname, "../preload/record.js"),
      nodeIntegration: true,
      contextIsolation: false,
      //  devTools: false
    },
  });
  remoteMain.enable(recordWindow.webContents);
  recordWindow.setResizable(false);
  recordWindow.setMenuBarVisibility(false);
  recordWindow.loadFile(path.join(__dirname, "../renderer/src/record.html"));
  //recordWindow.setMenuBarVisibility(false);

  return recordWindow;
}
ipcMain.on("openRecord", (event, arg) => {
  //console.log("Open Record");
  recordWin = createRecordWindow();
  recordWin.webContents.send("forWin2", arg);
});

app.allowRendererProcessReuse = false;
app.commandLine.appendSwitch("force_high_performance_gpu", "");
app.whenReady().then(() => {
  // session.defaultSession.setProxy({
  //   pacScript: pacFileUrl,
  // });
  gateCreateWindowWithLicense(createWindow);
  // createWindow();
  // session.defaultSession.webRequest.onHeadersReceived(
  //   { urls: ["https://bimasislam.kemenag.go.id/*"] },
  //   (details, callback) => {
  //     console.log(details);

  //     if (
  //       details.responseHeaders &&
  //       details.responseHeaders["Set-Cookie"] &&
  //       details.responseHeaders["Set-Cookie"].length &&
  //       !details.responseHeaders["Set-Cookie"][0].includes("SameSite=none")
  //     ) {
  //       details.responseHeaders["Set-Cookie"][0] =
  //         details.responseHeaders["Set-Cookie"][0] +
  //         "; SameSite=none; Secure=true";
  //     }
  //     callback({ cancel: false, responseHeaders: details.responseHeaders });
  //   }
  // );
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
ipcMain.on("get-jadwal-sholat", async (event, arg) => {
  var jadwal = await getSholat();
  mainWindow.webContents.send("jadwal-sholat", jadwal);
});
async function getSholat() {
  async function callAxiosWithRetry(config, depth, failMassage) {
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    try {
      return await axios(config);
    } catch (e) {
      if (depth > 20) {
        throw e;
      }
      console.log(failMassage);
      await wait(2 ** depth * 100);
      console.log("Retrying .. ".green + depth);
      return callAxiosWithRetry(config, depth + 1, failMassage);
    }
  }
  const today = new Date();
  const year = today.getFullYear();
  // Month is 0-indexed, so we add 1 to get the correct month
  const month = today.getMonth() + 1;
  var config1 = {
    httpAgent: pro_agent,
    httpsAgent: pro_agent,
    method: "get",
    url: "https://bimasislam.kemenag.go.id/jadwalshalat",
  };
  config1.withCredentials = true;
  const cookie = await callAxiosWithRetry(config1, 0, "Fail get cookie").then(
    function (response) {
      const cookies = response.headers["set-cookie"];
      const phpsessidCookie = cookies.find((cookie) =>
        cookie.includes("PHPSESSID")
      );
      return phpsessidCookie;
    }
  );
  var qs = require("qs");
  var data = qs.stringify({
    bln: month.toString().padStart(2, "0"),
    thn: year,
    x: "aab3238922bcc25a6f606eb525ffdc56",
    y: "854d6fae5ee42911677c739ee1734486",
  });
  var config = {
    httpAgent: pro_agent,
    httpsAgent: pro_agent,
    method: "post",
    url: "https://bimasislam.kemenag.go.id/ajax/getShalatbln",
    headers: {
      "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "sec-ch-ua-mobile": "?0",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
      "sec-ch-ua-platform": '"Windows"',
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Cookie: `${cookie}`,
    },
    data: data,
  };

  jadwal = await callAxiosWithRetry(config, 0, "Fail get Jadwal Sholat").then(
    function (response) {
      return response.data;
    }
  );
  return jadwal;
}
