module.exports = {
 isPortTaken: function(port) {
    return new Promise((resolve, rej) => {
        var net = require('net')
        var tester = net.createServer()
        .once('error', function (err) {
            if (err.code != 'EADDRINUSE') {
                rej(err)
                return 
            }
            resolve(true)
        })
        .once('listening', function() {
            tester.once('close', function() { resolve(false) })
        .close()
        })
        .listen(port)
    })
    } 
}