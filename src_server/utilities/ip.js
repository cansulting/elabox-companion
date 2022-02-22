const { networkInterfaces } = require('os');
const getIp = () =>{
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object
    console.log(results)
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results;
}
module.exports= {
    getIp:getIp,
}