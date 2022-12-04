const { RGBA } = require('custom-electron-titlebar');
const customTitlebar = require('custom-electron-titlebar');
const { remote } = require("electron")
const url = require('url');
const path = require('path');

let MyTitleBar = new customTitlebar.Titlebar({
    backgroundColor: new customTitlebar.Color(new RGBA(25, 27, 37, 0.679)),
    shadow: true,
    titleHorizontalAlignment: 'left',
    icon: url.format(path.join(__dirname, '/img', '/ico.png')),
});
const menu = new remote.Menu();
menu.append(new remote.MenuItem({

}));
MyTitleBar.updateTitle('TankLevel v1.1.0');
MyTitleBar.updateMenu(null);

