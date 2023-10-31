const { RGBA } = require("custom-electron-titlebar");
const customTitlebar = require("custom-electron-titlebar");
const { remote } = require("electron");
const url = require("url");
const path = require("path");
var pjson = require("../../../package.json");

let MyTitleBar = new customTitlebar.Titlebar({
  backgroundColor: new customTitlebar.Color(new RGBA(25, 27, 37, 0.679)),
  shadow: true,
  titleHorizontalAlignment: "left",
  icon: url.format(path.join(__dirname, "../img/ico.png")),
});
const menu = new remote.Menu();
menu.append(new remote.MenuItem({}));
MyTitleBar.updateTitle(`Tank Level v${pjson.version}`);
MyTitleBar.updateMenu(null);
