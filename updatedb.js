const updateFunction = (data, level, temp) => {
    if (data.level) {
        data.level = [...data.level, level];
    } else {
        data.level = [level]

    }
    if (data.time) {
        data.time = [...data.time, Date.now()];
    } else {
        data.time = [Date.now()]

    }
    if (data.temp) {
        data.temp = [...data.temp, temp];
    } else {
        data.temp = [temp]
    }
    return data;
}
module.exports = updateFunction