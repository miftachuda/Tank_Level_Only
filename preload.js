const MessageBuffer = require('./messagebuffer');
const parseString = require('xml2js').parseString;
const Net = require('net');
const { checkInternet, checkConnection, checkVPN } = require("./check_internet");
const { tanklist1, tanklist2, tanklist3, tanklist4, tanklist5, all_tank } = require("./tanklist")
//const knexInstance = require("./knexdb")
let vpnmode = true;
const moment = require("moment")
const cron = require('node-cron');
const path = require('path');
const recordArray = Array.from({ length: 12 }, (x, i) => 1);
const { ipcRenderer } = require("electron"); var tankdoc = document
const datasg = require("./datasg.json");
const e = require('express');

// checkVPN("10.54.127.226", 4444).then(() => {
//     vpnmode = false;
// }, () => {
//     vpnmode = true;
// });



if (vpnmode) {
    host1 = '10.54.188.100';
    host2 = host1;
    host3 = host1;
    host4 = host1;
    host5 = host1;
    host5 = host1;
    port1 = 6000;
    port2 = 6001;
    port3 = 6002;
    port4 = 6003;
    port5 = 6004;
    port6 = 6005;
} else {
    host1 = '10.54.127.226';
    host2 = '10.54.127.227';
    host3 = '10.54.127.231';
    host4 = '10.54.127.213';
    host5 = '10.54.127.223';
    host6 = '10.54.127.228';
    port1 = 4444;
    port2, port3, port4, port4, port5, port6 = port1;
}

function startTime() {

    time = moment().format("HH:mm:ss, DD MMM yyyy")
    tankdoc.getElementById('clock').innerHTML = time

}

const replaceText = (selector, text) => {
    const element = tankdoc.getElementById(selector)
    if (element) element.innerText = text
}

const replaceText2 = (selector, text) => {
    const x = tankdoc.getElementsByClassName(selector)
    var i;
    for (i = 0; i < x.length; i++) {
        if (x[i]) x[i].innerText = text
    }
}
function updatelog(text) {
    const log = tankdoc.getElementById('log')
    log.innerText = text
}
function updateDisplay(level, temp, name, x, levelcollect) {
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    if (name == x) {
        let komponen = tankdoc.querySelector(`[id~='0${x}']`)
        replaceText(`0${x}`, numberWithCommas(level))
        replaceText(`0${x}-t`, `  ${temp} °C`)
        if (levelcollect[x]) {
            if (levelcollect[x].level > level) {
                komponen.setAttribute('class', "tankturun")
                setTimeout(() => {
                    komponen.setAttribute('class', "tanklevel")
                }, 1000);
            } else if (levelcollect[x].level < level) {

                komponen.setAttribute('class', "tanknaik")
                setTimeout(() => {
                    komponen.setAttribute('class', "tanklevel")
                }, 1000);
            } else {

                komponen.setAttribute('class', "tanklevel")
            }

        }

        var currentdate = new Date()
        levelcollect[x] = (
            {
                level: level,
                temp: temp,
                time: Date.now()
            }
        )
    }
}

//update arrow not used
// function updatestatus(prevlevel, levelcollect) {
//     if (prevlevel != {} && levelcollect != {}) {
//         all_tank.forEach((tank) => {
//             //console.log(prevlevel)
//             let komponen = tankdoc.querySelector(`[tank~='0${tank}'] .arrow`)
//             //let border = tankdoc.querySelector(`[tank~='0${tank}']`)
//             if (prevlevel[tank].level > levelcollect[tank].level) {
//                 // border.setAttribute("tank", `0${tank} borderturun`);
//                 komponen.id = "down"
//                 komponen.setAttribute('class', "arrow visible")
//             } else if (prevlevel[tank].level < levelcollect[tank].level) {
//                 // border.setAttribute("tank", `0${tank} bordernaik`);
//                 komponen.id = "up"
//                 komponen.setAttribute('class', "arrow visible")
//             } else {
//                 // border.setAttribute("tank", `0${tank} borderidle`);
//                 komponen.id = "idle"
//                 komponen.setAttribute('class', "arrow unvisible")
//             }
//         })
//     }

// }

window.addEventListener('DOMContentLoaded', async () => {
    const button = tankdoc.getElementById('record');
    button.addEventListener('click', () => {
        console.log("load record windows")
        ipcRenderer.send('openRecord', recordArray);
    });
    function createBrowserWindow() {
        const remote = require('electron').remote;
        const BrowserWindow = remote.BrowserWindow;
        const win = new BrowserWindow({
            height: 1000,
            width: 980,
            frame: false,
            darkTheme: true,
            webPreferences: {
                preload: path.join(__dirname, 'record.js'),
                enableRemoteModule: true,
                nodeIntegration: true,
                contextIsolation: false
            },
        });
        win.setResizable(false)
        win.setMenuBarVisibility(false)
        win.loadFile('record.html')
    }
    const levelcollect = {};
    updatelog("Welcome to Tank App")
    // '0 0-23/2 * * *'
    cron.schedule('0 0-23/2 * * *', (x) => {
        // save 2 hours record to memmory
        recordArray.push({ data: JSON.stringify(levelcollect), timestamp: Date.now().toString() })
        recordArray.shift()

        console.log(`${x} record saved`)
        // save 2 hours record to sqlite db
        // var toSave = JSON.stringify(levelcollect)
        // if (toSave != "{}") {
        //     knexInstance("logsheet").insert({ data: toSave, timestamp: Date.now() }).then((x) => {
        //     })
        // }
    });
    setInterval(() => {

        startTime();
        //updatestatus(prevlevel, levelcollect);
    }, 1000);

    const footer = tankdoc.getElementById('footer')
    function fetching(host, port, tanklist, payload, updatelog) {
        const client = new Net.Socket();
        const received = new MessageBuffer(`<FG4TG SC="2">`)
        replaceText2("value", "load..");
        client.connect({ port: port, host: host });
        client.on('error', function () {
            updatelog(`cannot connect group ${host}`)
            footer.setAttribute("class", "footer footerred");
        });
        client.on('connect', function () {
            client.write(payload);
            setTimeout(updatelog(`connected to group ${host}`), 1000)
        });
        client.on("data", (data) => {
            received.push(data);
            while (!received.isFinished()) {
                const message = received.handleData()
                parseString(message, function (err, result) {
                    footer.setAttribute("class", "footer footergreen");
                    if (result != null) {
                        if (typeof result.TANK != "undefined") {
                            var level = `${result.TANK.PARAM[0].$.VALUE.replace(/'/, '').replace(/[+]/, '')}`;
                            var temp = `${result.TANK.PARAM[2].$.VALUE.replace(/[+]/, '')}`
                            var name = result.TANK.$.NAME
                            tanklist.forEach((x, i) => {
                                updateDisplay(level, temp, name, x, levelcollect, i)
                            })
                        }
                    }

                });
            }
        });
        client.on('timeout', () => {
            updatelog(`timeout connecting to ${host}`)
        });
        client.on('close', () => {
            tanklist.forEach((x, i) => {
                replaceText(`0${x}`, `closed`)
                replaceText(`0${x}-t`, `-`)
            })
            setTimeout(() => {
                client.destroy()
                fetching(host, port, tanklist, payload, updatelog);
            }, 2000)
            updatelog(`connection to ${host} closed`)
        });
        return client
    }
    const indintranet = tankdoc.getElementById('intranet')
    const indhost1 = tankdoc.getElementById('host1')
    const indhost2 = tankdoc.getElementById('host2')
    const indhost3 = tankdoc.getElementById('host3')
    const indhost4 = tankdoc.getElementById('host4')
    const payload1 = '<FG4TG MSGID="1135" KEY=""  VER="0"  VTYP="RealTime"><GROUPID>8</GROUPID></FG4TG>';
    const payload3 = '<FG4TG MSGID="1135" KEY=""  VER="0"  VTYP="RealTime"><GROUPID>146</GROUPID></FG4TG>';
    let client1;
    let client2;
    let client3;
    let client4;
    let client5;
    let client6;
    function loadit() {
        client1 = fetching(host1, port1, tanklist1, payload1, updatelog)
        client2 = fetching(host2, port2, tanklist2, payload1, updatelog)
        client3 = fetching(host3, port3, tanklist3, payload3, updatelog)
        client4 = fetching(host4, port4, tanklist4, payload1, updatelog)
        client5 = fetching(host5, port5, tanklist5, payload1, updatelog)
        // client6 = fetching(host6, port6, tanklist6, payload1, updatelog)

    }
    loadit()

    setInterval(() => {
        checkInternet(function (isConnected) {
            if (isConnected) {
                setTimeout(function () {
                    updatelog("connected to intranet"), 1000
                    indintranet.setAttribute("class", "status greencol")
                })
            } else {
                setTimeout(function () {
                    updatelog("please connect to pertamina network"), 1000
                    indintranet.setAttribute("class", "status redcol")
                })
            }
        });
        checkConnection(host1, port1, indhost1, 3000);
        checkConnection(host2, port2, indhost2, 3000);
        checkConnection(host3, port3, indhost3, 3000);
        checkConnection(host4, port4, indhost4, 3000);
    }, 3000)
    let levelArray = Array.from({ length: 181 }, (x, i) => 1);
    function logging() {
        // add log to memory
        levelArray.push({
            level: JSON.stringify(levelcollect),
        })
        levelArray.shift()
        // add log to sqlite db3
        // var toSave = JSON.stringify(levelcollect)
        // if (toSave != "{}") {
        //     knexInstance("tank").insert({ data: toSave, timestamp: Date.now() }).then((x) => {
        //     })
        // }

    }
    let mmortpd = true
    tankdoc.getElementById("mmortpd").addEventListener("click", () => {
        mmortpd = !mmortpd
    })
    setInterval(() => {
        logging()
    }, 5000);
    let record = []
    async function updateMove() {
        function calc(level, levelPast, time, timePast, tank) {
            let sg = datasg[tank]
            let selisih = level - levelPast
            let selisiht = (time - timePast) / 1000
            speed = ((selisih / selisiht) * 60 * 60).toFixed(1)
            tpd = speed * 24 * sg
            return { tpd, speed }
        }
        // get data from sqlitedb
        // let data = await knexInstance.select().table('tank').orderBy('timestamp', 'desc').limit(301)
        // let datas = data[1].data
        // // let time = data[1].timestamp
        // let dataPasts = data[90].data
        // // let timePast = data[90].timestamp
        // get data from memory
        let delta = 1
        let deltaExtend = 5
        let datas = levelArray[180]
        let dataPasts = levelArray[90]
        let dataPastsExtend = levelArray[0]
        // console.log(datas, dataPasts)
        all_tank.forEach((tank) => {
            let komponen = tankdoc.querySelector(`[tank~='0${tank}'] div:nth-child(6) img`)
            let border = tankdoc.querySelector(`[tank~='0${tank}']`)
            let rate = tankdoc.querySelector(`[tank~='0${tank}'] div:nth-child(5)`)
            let red = "./img/red.svg"
            let green = "./img/green.svg"
            if (dataPasts != 1) {
                if (
                    JSON.parse(dataPasts.level)[tank]
                ) {
                    // data frmo sqlite is string need to parse
                    let level = parseInt(JSON.parse(datas.level)[tank].level)
                    let timestamp = parseInt(JSON.parse(datas.level)[tank].time)
                    let levelPast = parseInt(JSON.parse(dataPasts.level)[tank].level)
                    let timestampPast = parseInt(JSON.parse(dataPasts.level)[tank].time)
                    let { tpd, speed } = calc(level, levelPast, timestamp, timestampPast, tank)
                    if (mmortpd) {
                        rate.innerHTML = speed
                    } else {
                        rate.innerHTML = tpd
                    }
                    if ((level - levelPast) < -delta) {
                        if (record[tank] != "down") {
                            border.setAttribute("tank", `0${tank} borderturun`);
                            // komponen.id = "down"
                            komponen.setAttribute("class", "visible blink")
                            komponen.src = red
                        }
                        record[tank] = "down"
                    } else if ((level - levelPast) > delta) {
                        if (record[tank] != "up") {
                            border.setAttribute("tank", `0${tank} bordernaik`);
                            // komponen.id = "up"
                            komponen.setAttribute("class", "visible blink")
                            komponen.src = green
                        }
                        record[tank] = "up"
                    } else {
                        if (dataPastsExtend != 1) {
                            if (JSON.parse(dataPastsExtend.level)[tank]) {
                                let level = parseInt(JSON.parse(datas.level)[tank].level)
                                let levelPastExtend = parseInt(JSON.parse(dataPastsExtend.level)[tank].level)
                                let timestamp = parseInt(JSON.parse(datas.level)[tank].time)
                                let timestampPast = parseInt(JSON.parse(dataPastsExtend.level)[tank].time)
                                let { tpd, speed } = calc(level, levelPast, timestamp, timestampPast, tank)
                                if (mmortpd) {
                                    rate.innerHTML = speed
                                } else {
                                    rate.innerHTML = tpd
                                }
                                if ((level - levelPastExtend) < -deltaExtend) {
                                    if (record[tank] != "down") {
                                        border.setAttribute("tank", `0${tank} borderturun`);
                                        // komponen.id = "down"
                                        komponen.setAttribute("class", "visible blink")
                                        komponen.src = red
                                    }
                                    record[tank] = "down"
                                } else if ((level - levelPastExtend) > deltaExtend) {
                                    if (record[tank] != "up") {
                                        border.setAttribute("tank", `0${tank} bordernaik`);
                                        // komponen.id = "up"
                                        komponen.setAttribute("class", "visible blink")
                                        komponen.src = green
                                    }
                                    record[tank] = "up"
                                }

                                else {
                                    if (record[tank] != "stable") {
                                        border.setAttribute("tank", `0${tank} borderidle`);
                                        // komponen.id = "idle"
                                        komponen.setAttribute("class", "unvisible")
                                        komponen.src = ""
                                    } else { }
                                    record[tank] = "stable"

                                }

                            }

                        }
                        // if (record[tank] != "stable") {
                        //     border.setAttribute("tank", `0${tank} borderidle`);
                        //     // komponen.id = "idle"
                        //     komponen.setAttribute("class", "unvisible")
                        //     komponen.src = ""
                        // } else {

                        // }
                        // record[tank] = "stable"

                    }

                }

            }
            //slow compare

        })

    }
    setInterval(() => {
        updateMove()
    }, 5000);


    tankdoc.getElementById('reload').addEventListener('click', () => {

        client1.destroy()
        client2.destroy()
        client3.destroy()
        client4.destroy()
        client5.destroy()
        client6.destroy()
        loadit()
    })

})
