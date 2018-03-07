
var net = require('net'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),

    Buffer = require('buffer').Buffer,
    WebSocketServer = require('ws').Server,

    webServer, wsServer,
    webRoot = path.resolve(__dirname, 'web');


// Handle new WebSocket client
new_client = function(client) {
    var clientAddr = client._socket.remoteAddress, log;

    var targetHost = '127.0.0.1',
        targetPort = 5900;

    log = function (msg) {
        console.log(' ' + clientAddr + ': '+ msg);
        console.log(' connecting to ' + targetHost + ': '+ targetPort);

    };

    var target = net.createConnection(targetPort, targetHost, function() {
        log('connected to target');
    });
    target.on('data', function(data) {
        try {
            client.send(data,{binary: true});
        } catch(e) {
            log("Client closed, cleaning up target");
            target.end();
        }
    });
    target.on('end', function() {
        log('target disconnected');
        client.close();
    });
    target.on('error', function() {
        log('target connection error');
        target.end();
        client.close();
    });

    client.on('message', function(msg) {
        //log('got message: ' + msg);
        if (client.protocol === 'base64') {
            target.write(new Buffer(msg, 'base64'));
        } else {
            target.write(msg,'binary');
        }
    });
    client.on('close', function(code, reason) {
        log('WebSocket client disconnected: ' + code + ' [' + reason + ']');
        target.end();
    });
    client.on('error', function(a) {
        log('WebSocket client error: ' + a);
        target.end();
    });
};


// Send an HTTP error response
http_error = function (response, code, msg) {
    response.writeHead(code, {"Content-Type": "text/plain"});
    response.write(msg + "\n");
    response.end();
    return;
}

// Process an HTTP static file request
http_request = function (request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(webRoot, uri);

    console.log('GET ' + uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            return http_error(response, 404, "404 Not Found");
        }

        if (fs.statSync(filename).isDirectory()) {
            filename += '/index.html';
        }

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                return http_error(response, 500, err);
            }

            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });
    });
};

console.log("WebSocket settings: ");
console.log("    - listening on port 3000");
console.log("    - Web server active. Serving: " + webRoot);
console.log("    - Running in unencrypted HTTP (ws://) mode");

webServer = http.createServer(http_request);
webServer.listen(3000, function() {
    wsServer = new WebSocketServer({server: webServer,
        /*handleProtocols: selectProtocol*/});
    wsServer.on('connection', new_client);
});
