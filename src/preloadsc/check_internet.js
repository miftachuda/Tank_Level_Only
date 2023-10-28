const checkInternet = (cb) => {
  require("dns").lookup("simops.pertamina.com", function (err) {
    if (err && err.code == "ENOTFOUND") {
      cb(false);
    } else {
      cb(true);
    }
  });
};

var net = require("net");

function checkConnection(host, port, indobj, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
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
    const socket = new net.Socket();
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

module.exports = {
  checkInternet,
  checkConnection,
  checkVPN,
};
