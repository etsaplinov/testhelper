const app = require('./app');
var path = require('path');
var http = require('http');
var https = require('https');
var fs = require('fs');


const PORT = process.env.PORT || 3004;

// Why don't I need http createServer
// app.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}!`)
// })
app.on('error', onError)



var options = {
    key: fs.readFileSync(path.resolve(__dirname, 'encryption/localhost.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'encryption/localhost.cert')),
    requestCert: false,
    rejectUnauthorized: false
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);

httpServer.listen(PORT);
httpsServer.listen(3005);


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}