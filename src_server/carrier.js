var shell = require('shelljs');

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err, 'Uncaught Exception thrown');
        process.exit(1);
    });


shell.exec(
    "echo elabox | sudo -S ./ela-bootstrapd --config=bootstrapd.conf --foreground",
    { maxBuffer: 1024 * 500 * 10000, detached: true, cwd: "/home/elabox/supernode/carrier/" },

    (err, stdout, stderr) => {
        if (err) {
            console.log("Failed CP", err);
            // throw (err)

        } else {
            console.log("Success CP", stdout);
            console.log("Warns CP", stderr);
        }
    }
);