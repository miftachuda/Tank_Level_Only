const moment = require("moment");
//const knexInstance = require("./knexdb")
const { ipcRenderer } = require("electron");

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}
window.addEventListener("DOMContentLoaded", async () => {
  ipcRenderer.on("forWin2", function (event, arg) {
    // console.log("for win2 ", arg);
    data = arg.slice(-5);
    //  console.log(data)
    for (num = 0; num < data.length; num++) {
      if (data[num] != 1) {
        //console.log("its array")
        let waktutank = document.getElementById(`${num}w`);
        let datatank = document.getElementById(`${num}`);

        waktutank.innerText = moment(parseInt(data[num].timestamp)).format(
          "DD-MM-yyyy HH:mm:ss"
        );

        let dataparsed = JSON.parse(data[num].data);
        function sortObject(obj) {
          return Object.keys(obj)
            .sort()
            .reduce(function (result, key) {
              result[key] = obj[key];
              return result;
            }, {});
        }
        let sorted_data = sortObject(dataparsed);
        for (const key in sorted_data) {
          let newelem = `<div period="${num}" tank="${key}"><span class="namatank">${key}</span><span class="leveltank">${formatNumber(
            sorted_data[key].level
          )}</span><span class="temptank" >${
            sorted_data[key].temp
          }</span></div>`;
          datatank.insertAdjacentHTML("beforeend", newelem);
        }
      }
    }
    // data.every((element, i) => {
    //     console.log(i)
    //     console.log(element)
    //     let waktutank = document.getElementById(`${i}w`)
    //     let datatank = document.getElementById(`${i}`)

    //     waktutank.innerText = moment(parseInt(element.timestamp)).format("DD-MM-yyyy HH:mm:ss")

    //     let data = JSON.parse(element.data)
    //     function sortObject(obj) {
    //         return Object.keys(obj).sort().reduce(function (result, key) {
    //             result[key] = obj[key];
    //             return result;
    //         }, {});
    //     }
    //     let sorted_data = sortObject(data)
    //     for (const key in sorted_data) {
    //         let newelem = `<div period="${i}" tank="${key}"><span class="namatank">${key}</span><span class="leveltank">${formatNumber(sorted_data[key].level)}</span><span class="temptank" >${sorted_data[key].temp}</span></div>`
    //         datatank.insertAdjacentHTML('beforeend', newelem);
    //     }
    //     return true;
    // });
  });
  // get data from sqlite
  // let data = await knexInstance.select().table('logsheet').orderBy('timestamp', 'desc').limit(5)
});
