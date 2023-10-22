const net = require('net');

function checkPort(host, port, timeout = 2000) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        const timer = setTimeout(() => {
            socket.destroy();
            reject(new Error('Timeout'));
        }, timeout);
        socket.connect(port, host, () => {
            clearTimeout(timer);
            socket.end();
            resolve(true);
        });
        socket.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}
checkPort('10.54.127.227', 4444)
    .then((result) => {
        console.log('Host and port are alive:', result);
    })
    .catch((err) => {
        console.error('Error:', err);
    });