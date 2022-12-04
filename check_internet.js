const checkInternet = (cb) => {


    require('dns').lookup('simops.pertamina.com', function (err) {
        if (err && err.code == "ENOTFOUND") {

            cb(false);
        } else {
            cb(true);
        }
    })
}

var net = require('net');
var Promise = require('bluebird');

function checkConnection(host, port, indobj, timeout) {
    return new Promise(function (resolve, reject) {
        timeout = timeout || 10000;     // default of 10 seconds
        var timer = setTimeout(function () {
            reject("timeout");
            socket.end();
        }, timeout);
        var socket = net.createConnection(port, host, function () {
            clearTimeout(timer);
            resolve();
            socket.end();
        });
        socket.on('error', function (err) {
            clearTimeout(timer);
            reject(err);
        });
    }).then(function () {
        indobj.setAttribute("class", "status greencol")
    }, function (err) {
        indobj.setAttribute("class", "status redcol")
    });
}
function checkVPN(host, port) {
    return new Promise(function (resolve, reject) {
        timeout = 10000;     // default of 10 seconds
        var timer = setTimeout(function () {
            reject("timeout");
            socket.end();
        }, timeout);
        var socket = net.createConnection(port, host, function () {
            clearTimeout(timer);
            resolve();
            socket.end();
        });
        socket.on('error', function (err) {
            clearTimeout(timer);
            reject(err);
        });
    })
}



module.exports = {
    checkInternet: checkInternet,
    checkConnection: checkConnection,
    checkVPN: checkVPN
};