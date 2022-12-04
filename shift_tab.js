const shift = require("./shift.js")
const next = Date.now() + (3600000 * 8)
const double_next = Date.now() + (3600000 * 16)
setInterval(() => {
    document.getElementById("shiftblock1").innerHTML = shift.checkOnDateShift(Date.now()).split(" ")[0]
    document.getElementById("shiftblock2").innerHTML = `&#x2794; ${shift.checkOnDateShift(next).split(" ")[0]}`
    document.getElementById("shiftblock3").innerHTML = `&#x2794; ${shift.checkOnDateShift(double_next).split(" ")[0]}`
    document.getElementById("masuk_apa1").innerHTML = `Shift ${shift.checkOnDateShift(Date.now()).split(" ")[1]}`
    document.getElementById("masuk_apa2").innerHTML = `Shift ${shift.checkOnDateShift(next).split(" ")[1]}`
    document.getElementById("masuk_apa3").innerHTML = `Shift ${shift.checkOnDateShift(double_next).split(" ")[1]}`
    //  document.getElementById('nextshift').innerHTML = `Next : ${listshift[daynext][getPeriod(minutesnext)]}`

}, 1000)