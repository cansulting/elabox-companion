module.exports = {
 isPortTaken: function(port) {
    return new Promise((resolve, reject) => {
        var net = require('net')
        const socket = new net.Socket();

		const onError = () => {
			socket.destroy();
			resolve(false);
		};

		socket.setTimeout(2000);
		socket.once('error', onError);
		socket.once('timeout', onError);

		socket.connect(port, '127.0.0.1', () => {
			socket.end();
			resolve(true);
		});
    })
    } 
}