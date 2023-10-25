const shift = require("./shift.js");

function updateShift() {
  //console.log(document);
  let now = Date.now();
  let next = now + 3600000 * 8;
  let double_next = now + 3600000 * 16;
  document.getElementById("shiftblock1").innerHTML = shift
    .checkOnDateShift(now)
    .split(" ")[0];
  document.getElementById("shiftblock2").innerHTML = `&#x2794; ${
    shift.checkOnDateShift(next).split(" ")[0]
  }`;
  document.getElementById("shiftblock3").innerHTML = `&#x2794; ${
    shift.checkOnDateShift(double_next).split(" ")[0]
  }`;
  document.getElementById("masuk_apa1").innerHTML = `Shift ${
    shift.checkOnDateShift(now).split(" ")[1]
  }`;
  document.getElementById("masuk_apa2").innerHTML = `Shift ${
    shift.checkOnDateShift(next).split(" ")[1]
  }`;
  document.getElementById("masuk_apa3").innerHTML = `Shift ${
    shift.checkOnDateShift(double_next).split(" ")[1]
  }`;
  //  document.getElementById('nextshift').innerHTML = `Next : ${listshift[daynext][getPeriod(minutesnext)]}`

  console.log(shift.checkOnDateShift(now).split(" ")[0]);
  console.log(shift.checkOnDateShift(next).split(" ")[0]);
  console.log(shift.checkOnDateShift(double_next).split(" ")[0]);
}

module.exports = updateShift;
