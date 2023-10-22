const moment = require("moment")
const listshift =
    [
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
        ["D3 Malam", "B1 Pagi", "C2 Sore", "A Off-Pagi"]
    ]
function getPeriod(min) {
    if (min < 480) {
        return 0
    } if (min < 960) {
        return 1
    } else {
        return 2
    }
}
function checkCurrentShift() {
    var now = moment(new Date());
    var end = moment("2021-12-22");
    var duration = moment.duration(now.diff(end));
    var day = Math.trunc(duration.asDays()) % 12
    var minutes = Math.trunc(duration.asMinutes()) % 1440
    return listshift[day][getPeriod(minutes)];
}
function checkOnDateShift(date) {
    var now = moment(date);
    var end = moment("2021-12-22");
    var duration = moment.duration(now.diff(end));
    var day = Math.trunc(duration.asDays()) % 12
    var minutes = Math.trunc(duration.asMinutes()) % 1440
    return listshift[day][getPeriod(minutes)];
}

module.exports = {
    checkCurrentShift, checkOnDateShift
}
