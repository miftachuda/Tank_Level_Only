const parseString = require("xml2js").parseString;
const Net = require("net");

let vpnmode = false;
const moment = require("moment");
const cron = require("node-cron");
const path = require("path");
const recordArray = Array.from({ length: 12 }, (x, i) => 1);
const { ipcRenderer } = require("electron");
var tankdoc = document;
console.log(document);
const datasg = require("../renderer/img/datasg.json");
var pjson = require("../../package.json");
const listshift = [
  ["A1 Malam", "B2 Pagi", "C3 Sore", "D Off-Malam"],
  ["A2 Malam", "B3 Pagi", "D1 Sore", "C Off-Sore"],
  ["A3 Malam", "C1 Pagi", "D2 Sore", "B Off-Pagi"],
  ["B1 Malam", "C2 Pagi", "D3 Sore", "A Off-Malam"],
  ["B2 Malam", "C3 Pagi", "A1 Sore", "D Off-Sore"],
  ["B3 Malam", "D1 Pagi", "A2 Sore", "C Off-Pagi"],
  ["C1 Malam", "D2 Pagi", "A3 Sore", "B Off-Malam"],
  ["C2 Malam", "D3 Pagi", "B1 Sore", "A Off-Sore"],
  ["C3 Malam", "A1 Pagi", "B2 Sore", "D Off-Pagi"],
  ["D1 Malam", "A2 Pagi", "B3 Sore", "C Off-Malam"],
  ["D2 Malam", "A3 Pagi", "C1 Sore", "B Off-Sore"],
  ["D3 Malam", "B1 Pagi", "C2 Sore", "A Off-Pagi"],
];
function getPeriod(min) {
  if (min < 480) {
    return 0;
  }
  if (min < 960) {
    return 1;
  } else {
    return 2;
  }
}
function checkCurrentShift() {
  var now = moment(new Date());
  var end = moment("2021-12-22");
  var duration = moment.duration(now.diff(end));
  var day = Math.trunc(duration.asDays()) % 12;
  var minutes = Math.trunc(duration.asMinutes()) % 1440;
  return listshift[day][getPeriod(minutes)];
}
function cods(date) {
  var now = moment(date);
  var end = moment("2021-12-22");
  var duration = moment.duration(now.diff(end));
  var day = Math.trunc(duration.asDays()) % 12;
  var minutes = Math.trunc(duration.asMinutes()) % 1440;
  return listshift[day][getPeriod(minutes)];
}
function us() {
  //console.log(document);
  let now = Date.now();
  let next = now + 3600000 * 8;
  let double_next = now + 3600000 * 16;
  document.getElementById("shiftblock1").innerHTML = cods(now).split(" ")[0];
  document.getElementById("shiftblock2").innerHTML = `&#x2794; ${
    cods(next).split(" ")[0]
  }`;
  document.getElementById("shiftblock3").innerHTML = `&#x2794; ${
    cods(double_next).split(" ")[0]
  }`;
  document.getElementById("masuk_apa1").innerHTML = `Shift ${
    cods(now).split(" ")[1]
  }`;
  document.getElementById("masuk_apa2").innerHTML = `Shift ${
    cods(next).split(" ")[1]
  }`;
  document.getElementById("masuk_apa3").innerHTML = `Shift ${
    cods(double_next).split(" ")[1]
  }`;
}
const checkInternet = (cb) => {
  require("dns").lookup("simops.pertamina.com", function (err) {
    if (err && err.code == "ENOTFOUND") {
      cb(false);
    } else {
      cb(true);
    }
  });
};

class MessageBuffer {
  constructor(delimiter) {
    this.delimiter = delimiter;
    this.buffer = "";
  }

  isFinished() {
    if (
      this.buffer.length === 0 ||
      this.buffer.indexOf(this.delimiter) === -1
    ) {
      return true;
    }
    return false;
  }

  push(data) {
    this.buffer += data;
  }

  getMessage() {
    const delimiterIndex = this.buffer.indexOf(this.delimiter);
    if (delimiterIndex !== -1) {
      const message = this.buffer.slice(0, delimiterIndex);
      this.buffer = this.buffer.replace(message + this.delimiter, "");
      return message;
    }
    return null;
  }

  handleData() {
    /**
     * Try to accumulate the buffer with messages
     *
     * If the server isnt sending delimiters for some reason
     * then nothing will ever come back for these requests
     */
    const message = this.getMessage();
    return message;
  }
}
function checkConnection(host, port, indobj, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const socket = new Net.Socket();
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error("Timeout"));
    }, timeout);
    socket.connect(port, host, () => {
      clearTimeout(timer);
      socket.end();
      resolve(true);
    });
    socket.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  }).then(
    function () {
      indobj.setAttribute("class", "status greencol");
    },
    function (err) {
      console.log(err);
      indobj.setAttribute("class", "status redcol");
    }
  );
}
function checkVPN(host, port, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const socket = new Net.Socket();
    const timer = setTimeout(() => {
      socket.destroy();
      reject(new Error("Timeout"));
    }, timeout);
    socket.connect(port, host, () => {
      clearTimeout(timer);
      socket.end();
      resolve(true);
    });
    socket.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

function ih() {
  checkVPN("10.54.127.226", 4444).then(
    () => {
      host1 = "10.54.127.226";
      host2 = "10.54.127.227";
      host3 = "10.54.127.231";
      host4 = "10.54.127.213";
      host5 = "10.54.127.223";
      host6 = "10.54.127.228";
      host7 = "10.54.127.234";
      host8 = "10.54.127.235";
      port1 = 4444;
      port2 = 4444;
      port3 = 4444;
      port4 = 4444;
      port5 = 4444;
      port6 = 4444;
      port7 = 4444;
      port8 = 4444;
    },
    () => {
      host1 = "10.54.188.74";
      host2 = host1;
      host3 = host1;
      host4 = host1;
      host5 = host1;
      host6 = host1;
      host7 = host1;
      host8 = host1;
      port1 = 6000;
      port2 = 6001;
      port3 = 6002;
      port4 = 6003;
      port5 = 6004;
      port6 = 6005;
      port7 = 6006;
      port8 = 6007;
    }
  );
}
host1 = "10.54.127.213";
host2 = "10.54.127.223";
host3 = "10.54.127.226";
host4 = "10.54.127.227";
host5 = "10.54.127.228";
host6 = "10.54.127.229";
host7 = "10.54.127.231";
host8 = "10.54.127.234";
host9 = "10.54.127.235";

// host1 = "10.54.127.226";
// host2 = "10.54.127.227";
// host3 = "10.54.127.231";
// host4 = "10.54.127.213";
// host5 = "10.54.127.223";
// host6 = "10.54.127.228";
// host7 = "10.54.127.234";
// host8 = "10.54.127.235";
// host9 = "10.54.127.229";
port1 = 4444;
port2 = 4444;
port3 = 4444;
port4 = 4444;
port5 = 4444;
port6 = 4444;
port7 = 4444;
port8 = 4444;
port9 = 4444;
const tanklist1 = [
  "41T-301",
  "41T-302",
  "41T-303",
  "41T-304",
  "41T-305",
  "41T-306",
  "41T-307",
  "41T-308",
  "41T-309",
  "41T-310",
  "41T-311",
  "41T-315",
  "41T-316",
  "41T-317",
]; //213
const tanklist2 = ["35T-2", "35T-4"]; //223
const tanklist3 = [
  "41T-111",
  "41T-112",
  "41T-113",
  "41T-114",
  "41T-115",
  "41T-116",
  "41T-117",
  "41T-118",
  "41T-121",
]; //226
const tanklist4 = [
  "41T-101",
  "41T-102",
  "41T-103",
  "41T-104",
  "41T-105",
  "41T-106",
  "41T-107",
  "41T-108",
  "41T-122",
]; //227
const tanklist5 = ["41T-25", "41T-26"]; //228
const tanklist6 = ["41T-24"]; //229
const tanklist7 = ["41T-109", "41T-110", "41T-119", "41T-120"]; //231
const tanklist8 = [
  "41T-304",
  "41T-305",
  "41T-306",
  "41T-307",
  "41T-308",
  "41T-309",
  "41T-315",
  "41T-316",
]; //234
const tanklist9 = [
  "41T-301",
  "41T-302",
  "41T-303",
  "41T-310",
  "41T-311",
  "41T-312",
  "41T-313",
  "41T-314",
  "41T-317",
]; //235
const all_tank_raw = tanklist1.concat(
  tanklist2,
  tanklist3,
  tanklist4,
  tanklist5,
  tanklist6,
  tanklist7,
  tanklist8,
  tanklist9
);
const all_tank = Array.from(new Set(all_tank_raw));
const all_tank_arr = [
  tanklist1,
  tanklist2,
  tanklist3,
  tanklist4,
  tanklist5,
  tanklist6,
  tanklist7,
  tanklist8,
  tanklist8,
  tanklist9,
];
function t() {
  time = moment().format("HH:mm:ss[</br>]DD MMM yyyy");
  tankdoc.getElementById("clock").innerHTML = time;
}
function y(x) {
  return x.replace(/\s/g, "");
}
const s = (selector, text) => {
  const element = tankdoc.getElementById(selector);
  if (element) element.innerText = text;
};

const r = (selector, text) => {
  const x = tankdoc.getElementsByClassName(selector);
  var i;
  for (i = 0; i < x.length; i++) {
    if (x[i]) x[i].innerText = text;
  }
};
function ul(text) {
  const log = tankdoc.getElementById("log");
  log.innerText = text;
}

function ud(level, temp, name, x, lc) {
  function nwc(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  if (y(name) == y(x)) {
    let komponen = tankdoc.querySelector(`[id~='0${x}']`);
    s(`0${x}`, nwc(level));
    s(`0${x}-t`, `  ${temp} °C`);
    if (lc[x]) {
      if (lc[x].level > level) {
        komponen.setAttribute("class", "tankturun");
        setTimeout(() => {
          komponen.setAttribute("class", "tanklevel");
        }, 1000);
      } else if (lc[x].level < level) {
        komponen.setAttribute("class", "tanknaik");
        setTimeout(() => {
          komponen.setAttribute("class", "tanklevel");
        }, 1000);
      } else {
        komponen.setAttribute("class", "tanklevel");
      }
    }

    lc[x] = {
      level: level,
      temp: temp,
      time: Date.now(),
    };
  }
}

//update arrow not used
// function updatestatus(prevlevel, lc) {
//     if (prevlevel != {} && lc != {}) {
//         all_tank.forEach((tank) => {
//             //console.log(prevlevel)
//             let komponen = tankdoc.querySelector(`[tank~='0${tank}'] .arrow`)
//             //let border = tankdoc.querySelector(`[tank~='0${tank}']`)
//             if (prevlevel[tank].level > lc[tank].level) {
//                 // border.setAttribute("tank", `0${tank} borderturun`);
//                 komponen.id = "down"
//                 komponen.setAttribute('class', "arrow visible")
//             } else if (prevlevel[tank].level < lc[tank].level) {
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

window.addEventListener("DOMContentLoaded", async () => {
  let title = document.getElementsByName("title");
  title.innerText = `Tank Level v${pjson.version}`;
  us();
  setInterval(() => {
    us();
  }, 10000);
  var tooltip = tankdoc.getElementsByClassName("tooltiptext");
  var arr_tooltip = Array.from(tooltip);
  arr_tooltip.forEach((el, i) => {
    el.innerHTML = all_tank_arr[i].join("<br />");
  });

  const select = tankdoc.getElementById("ratespeed");
  let select_button = "0";
  select.addEventListener("change", function (x) {
    select_button = x.srcElement.value;
  });
  const button = tankdoc.getElementById("record");
  button.addEventListener("click", () => {
    // console.log("load record windows");
    ipcRenderer.send("openRecord", recordArray);
  });

  const lc = {};
  ul("Welcome to Tank App");
  // '0 0-23/2 * * *'
  cron.schedule("0 0-23/2 * * *", (x) => {
    // save 2 hours record to memmory
    recordArray.push({
      data: JSON.stringify(lc),
      timestamp: Date.now().toString(),
    });
    recordArray.shift();

    //console.log(`${x} record saved`)
    // save 2 hours record to sqlite db
    // var toSave = JSON.stringify(lc)
    // if (toSave != "{}") {
    //     knexInstance("logsheet").insert({ data: toSave, timestamp: Date.now() }).then((x) => {
    //     })
    // }
  });
  setInterval(() => {
    t();
    //updatestatus(prevlevel, lc);
  }, 1000);

  const footer = tankdoc.getElementById("footer");
  function fetching(host, port, tanklist, payload, ul) {
    const client = new Net.Socket();
    const received = new MessageBuffer(`<FG4TG SC="2">`);
    r("value", "load..");
    client.connect({ port: port, host: host });
    client.on("error", function () {
      ul(`cannot connect group ${host}`);
      footer.setAttribute("class", "footer footerred");
    });
    client.on("connect", function () {
      client.write(payload);
      setTimeout(ul(`connected to group ${host}`), 1000);
    });
    client.on("data", (data) => {
      received.push(data);
      while (!received.isFinished()) {
        const message = received.handleData();
        parseString(message, function (err, result) {
          footer.setAttribute("class", "footer footergreen");
          if (result != null) {
            if (typeof result.TANK != "undefined") {
              var level = `${result.TANK.PARAM[0].$.VALUE.replace(
                /'/,
                ""
              ).replace(/[+]/, "")}`;
              var temp = `${result.TANK.PARAM[2].$.VALUE.replace(/[+]/, "")}`;
              var name = result.TANK.$.NAME.toString();
              tanklist.forEach((x, i) => {
                ud(level, temp, name, x, lc, i);
              });
            }
          }
        });
      }
    });
    client.on("timeout", () => {
      ul(`timeout connecting to ${host}`);
    });
    client.on("close", () => {
      tanklist.forEach((x, i) => {
        s(`0${x}`, `closed`);
        s(`0${x}-t`, `-`);
      });
      setTimeout(() => {
        client.destroy();
        fetching(host, port, tanklist, payload, ul);
      }, 2000);
      ul(`connection to ${host} closed`);
    });
    return client;
  }
  const indintranet = tankdoc.getElementById("intranet");
  const indhost1 = tankdoc.getElementById("host1");
  const indhost2 = tankdoc.getElementById("host2");
  const indhost3 = tankdoc.getElementById("host3");
  const indhost4 = tankdoc.getElementById("host4");
  const indhost5 = tankdoc.getElementById("host5");
  const indhost6 = tankdoc.getElementById("host6");
  const indhost7 = tankdoc.getElementById("host7");
  const indhost8 = tankdoc.getElementById("host8");
  const indhost9 = tankdoc.getElementById("host9");
  const payload1 =
    '<FG4TG MSGID="1135" KEY=""  VER="0"  VTYP="RealTime"><GROUPID>8</GROUPID></FG4TG>'; //234,226,227,223
  const payload2 =
    '<FG4TG MSGID="1135" KEY=""  VER="0"  VTYP="RealTime"><GROUPID>146</GROUPID></FG4TG>'; //231
  const payload3 =
    '<FG4TG MSGID="1135" KEY=""  VER="0"  VTYP="RealTime"><GROUPID>74</GROUPID></FG4TG>'; //228
  const payload4 =
    '<FG4TG MSGID="1135" KEY=""  VER="0"  VTYP="RealTime"><GROUPID>216</GROUPID></FG4TG>'; //235
  const payload5 =
    '<FG4TG MSGID="1135" KEY=""  VER="0"  VTYP="RealTime"><GROUPID>77</GROUPID></FG4TG>'; //229
  let client1;
  let client2;
  let client3;
  let client4;
  let client5;
  let client6;
  let client7;
  let client8;
  let client9;

  function loadit() {
    // client1 = fetching(host1, port1, tanklist1, payload1, ul);//213
    client2 = fetching(host2, port2, tanklist2, payload1, ul); //223
    client3 = fetching(host3, port3, tanklist3, payload1, ul); //226
    client4 = fetching(host4, port4, tanklist4, payload1, ul); //227
    client5 = fetching(host5, port5, tanklist5, payload3, ul); //228
    client6 = fetching(host6, port6, tanklist6, payload1, ul); //229
    client7 = fetching(host7, port7, tanklist7, payload2, ul); //231
    client8 = fetching(host8, port8, tanklist8, payload1, ul); //234
    client9 = fetching(host9, port9, tanklist9, payload4, ul); //225
  }
  loadit();

  // setInterval(() => {
  //   checkInternet(function (isConnected) {
  //     if (isConnected) {
  //       setTimeout(function () {
  //         ul("connected to intranet"), 1000;
  //         indintranet.setAttribute("class", "status greencol");
  //       });
  //     } else {
  //       setTimeout(function () {
  //         ul("please connect to pertamina Network"), 1000;
  //         indintranet.setAttribute("class", "status redcol");
  //       });
  //     }
  //   });
  //   checkConnection(host1, port1, indhost1, 3000);
  //   checkConnection(host2, port2, indhost2, 3000);
  //   checkConnection(host3, port3, indhost3, 3000);
  //   checkConnection(host4, port4, indhost4, 3000);
  //   checkConnection(host5, port5, indhost5, 3000);
  //   checkConnection(host6, port6, indhost6, 3000);
  //   checkConnection(host7, port7, indhost7, 3000);
  //   checkConnection(host8, port8, indhost8, 3000);
  //   checkConnection(host9, port9, indhost9, 3000);
  // }, 3000);
  // setInterval(() => {
  //   checkVPN("10.54.127.226", 4444).then(
  //     () => {
  //       if (port1 != 4444) {
  //         host1 = "10.54.127.226";
  //         host2 = "10.54.127.227";
  //         host3 = "10.54.127.231";
  //         host4 = "10.54.127.213";
  //         host5 = "10.54.127.223";
  //         host6 = "10.54.127.228";
  //         host7 = "10.54.127.234";
  //         host8 = "10.54.127.235";
  //         port1 = 4444;
  //         port2 = 4444;
  //         port3 = 4444;
  //         port4 = 4444;
  //         port5 = 4444;
  //         port6 = 4444;
  //         port7 = 4444;
  //         port8 = 4444;
  //         loadit();
  //       }
  //     },
  //     () => {
  //       if (port1 != 6000) {
  //         host1 = "10.54.188.74";
  //         host2 = host1;
  //         host3 = host1;
  //         host4 = host1;
  //         host5 = host1;
  //         host6 = host1;
  //         host7 = host1;
  //         host8 = host1;
  //         port1 = 6000;
  //         port2 = 6001;
  //         port3 = 6002;
  //         port4 = 6003;
  //         port5 = 6004;
  //         port6 = 6005;
  //         port7 = 6006;
  //         port8 = 6007;
  //         loadit();
  //       }
  //     }
  //   );
  // }, 10000);
  let levelArray = Array.from({ length: 181 }, (x, i) => 1);
  function logging() {
    // add log to memory
    levelArray.push({
      level: JSON.stringify(lc),
    });
    levelArray.shift();
    // add log to sqlite db3
    // var toSave = JSON.stringify(lc)
    // if (toSave != "{}") {
    //     knexInstance("tank").insert({ data: toSave, timestamp: Date.now() }).then((x) => {
    //     })
    // }
  }

  setInterval(() => {
    logging();
  }, 5000);
  let record = [];
  async function um() {
    function calc(level, levelPast, time, timePast, tank) {
      let sg = datasg[1][tank];
      let diameter = datasg[0][tank];
      let selisih = level - levelPast;
      let selisiht = (time - timePast) / 1000;
      if (selisih != 0 && selisiht != 0) {
        mm_per_hour = ((selisih / selisiht) * 60 * 60).toFixed(1);
        mm_per_8hour = ((selisih / selisiht) * 60 * 60 * 8).toFixed(1);
        mm_per_day = ((selisih / selisiht) * 60 * 60 * 24).toFixed(1);
        meter_cubic_hour = (
          mm_per_hour *
          (((22 / 7) * (diameter / 2) ** 2) / 1000000000)
        ).toFixed(1);
        ton_per_day = (
          mm_per_hour *
          (((22 / 7) * (diameter / 2) ** 2) / 1000000000) *
          sg *
          24
        ).toFixed(1);
        return {
          mm_per_hour,
          mm_per_8hour,
          mm_per_day,
          meter_cubic_hour,
          ton_per_day,
        };
      } else {
        mm_per_hour =
          mm_per_8hour =
          mm_per_day =
          meter_cubic_hour =
          ton_per_day =
            "Refresh";
        return {
          mm_per_hour,
          mm_per_8hour,
          mm_per_day,
          meter_cubic_hour,
          ton_per_day,
        };
      }
    }
    // get data from sqlitedb
    // let data = await knexInstance.select().table('tank').orderBy('timestamp', 'desc').limit(301)
    // let datas = data[1].data
    // // let time = data[1].timestamp
    // let dataPasts = data[90].data
    // // let timePast = data[90].timestamp
    // get data from memory
    let delta = 4;
    let deltaExtend = 5;
    let datas = levelArray[180];
    let dataPasts = levelArray[90];
    let dataPastsExtend = levelArray[0];
    // console.log(datas, dataPasts)
    all_tank.forEach((tank) => {
      let komponen = tankdoc.querySelector(
        `[tank~='0${tank}'] div:nth-child(6) img`
      );
      let border = tankdoc.querySelector(`[tank~='0${tank}']`);
      let rate = tankdoc.querySelector(`[tank~='0${tank}'] div:nth-child(5)`);
      let red = "../img/red.svg";
      let green = "../img/green.svg";
      //fast move
      if (dataPasts != 1) {
        if (JSON.parse(dataPasts.level)[tank]) {
          let level = parseInt(JSON.parse(datas.level)[tank].level) ?? 0;
          // let timestamp = parseInt(JSON.parse(datas.level)[tank].time) ?? 1
          let levelPast =
            parseInt(JSON.parse(dataPasts.level)[tank].level) ?? 0;

          // let timestampPast = parseInt(JSON.parse(dataPasts.level)[tank].time) ?? 0
          // let { mm_per_hour, mm_per_8hour, mm_per_day, meter_cubic_hour, ton_per_day } = calc(level, levelPast, timestamp, timestampPast, tank)
          // if (mm_per_hour > 0) {
          //     rate.className = "rate rateup"
          // } else if (mm_per_hour < 0) {
          //     rate.className = "rate ratedown"
          // } else {
          //     rate.className = "rate"
          // }
          // switch (select_button) {
          //     case "0":
          //         rate.innerHTML = `${mm_per_hour} mm/hr`
          //         break;
          //     case "1":
          //         rate.innerHTML = `${meter_cubic_hour} m³/hr`
          //         break;
          //     case "2":
          //         rate.innerHTML = `${ton_per_day} ton/day`
          //         break;
          //     case "3":
          //         rate.innerHTML = `${mm_per_day} mm/day`
          //         break;
          //     case "4":
          //         rate.innerHTML = `${mm_per_8hour} mm/8hr`
          //         break;
          //     default:
          //         break;
          // }
          if (level - levelPast < -delta) {
            if (record[tank] != "down") {
              border.setAttribute("tank", `0${tank} borderturun`);
              // komponen.id = "down"
              komponen.setAttribute("class", "visible blink");
              komponen.src = red;
            }
            record[tank] = "down";
          } else if (level - levelPast > delta) {
            if (record[tank] != "up") {
              border.setAttribute("tank", `0${tank} bordernaik`);
              // komponen.id = "up"
              komponen.setAttribute("class", "visible blink");
              komponen.src = green;
            }
            record[tank] = "up";
          } else {
            if (dataPastsExtend != 1) {
              if (JSON.parse(dataPastsExtend.level)[tank]) {
                let levelPastExtend =
                  parseInt(JSON.parse(dataPastsExtend.level)[tank].level) ?? 0;
                if (level - levelPastExtend < -deltaExtend) {
                  if (record[tank] != "down") {
                    border.setAttribute("tank", `0${tank} borderturun`);
                    komponen.setAttribute("class", "visible blink");
                    komponen.src = red;
                  }
                  record[tank] = "down";
                } else if (level - levelPastExtend > deltaExtend) {
                  if (record[tank] != "up") {
                    border.setAttribute("tank", `0${tank} bordernaik`);
                    komponen.setAttribute("class", "visible blink");
                    komponen.src = green;
                  }
                  record[tank] = "up";
                } else {
                  if (record[tank] != "stable") {
                    border.setAttribute("tank", `0${tank} borderidle`);
                    komponen.setAttribute("class", "unvisible");
                    komponen.src = "";
                  } else {
                  }
                  record[tank] = "stable";
                }
              } else {
                if (record[tank] != "stable") {
                  border.setAttribute("tank", `0${tank} borderidle`);
                  komponen.setAttribute("class", "unvisible");
                  komponen.src = "";
                } else {
                }
                record[tank] = "stable";
              }
            } else {
              if (record[tank] != "stable") {
                border.setAttribute("tank", `0${tank} borderidle`);
                komponen.setAttribute("class", "unvisible");
                komponen.src = "";
              } else {
              }
              record[tank] = "stable";
            }
          }
        }
      } else {
        if (record[tank] != "stable") {
          border.setAttribute("tank", `0${tank} borderidle`);
          komponen.setAttribute("class", "unvisible");
          komponen.src = "";
        } else {
        }
        record[tank] = "stable";
      }
      //rate move
      if (dataPastsExtend != 1) {
        if (JSON.parse(dataPastsExtend.level)[tank]) {
          let level = parseInt(JSON.parse(datas.level)[tank].level) ?? 0;
          let levelPastExtend =
            parseInt(JSON.parse(dataPastsExtend.level)[tank].level) ?? 0;
          let timestamp = parseInt(JSON.parse(datas.level)[tank].time) ?? 0;
          let timestampPast =
            parseInt(JSON.parse(dataPastsExtend.level)[tank].time) ?? 0;
          let {
            mm_per_hour,
            mm_per_8hour,
            mm_per_day,
            meter_cubic_hour,
            ton_per_day,
          } = calc(level, levelPastExtend, timestamp, timestampPast, tank);
          if (mm_per_hour > 0) {
            rate.className = "rate rateup";
          } else if (mm_per_hour < 0) {
            rate.className = "rate ratedown";
          } else {
            rate.className = "rate";
          }
          switch (select_button) {
            case "0":
              rate.innerHTML = `${mm_per_hour} mm/hr`;
              break;
            case "1":
              rate.innerHTML = `${meter_cubic_hour} m³/hr`;
              break;
            case "2":
              rate.innerHTML = `${ton_per_day} ton/day`;
              break;
            case "3":
              rate.innerHTML = `${mm_per_day} mm/day`;
              break;
            case "4":
              rate.innerHTML = `${mm_per_8hour} mm/8hr`;
              break;
            default:
              break;
          }
        }
      }
    });
  }
  setInterval(() => {
    um();
  }, 5000);

  tankdoc.getElementById("reload").addEventListener("click", () => {
    client1.destroy();
    client2.destroy();
    client3.destroy();
    //client4.destroy()
    client5.destroy();
    client6.destroy();
    client7.destroy();
    client8.destroy();

    loadit();
  });
});
