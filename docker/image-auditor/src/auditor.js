var dgram = require("dgram");

var socket = dgram.createSocket("udp4");

var net = require("net");

var moment = require("moment");

var protocol = require("./protocol");

// Musician joinig multicast group
socket.bind(protocol.PORT, function() {
    console.log("Joining the multicast group");
    socket.addMembership(protocol.MULTICAST_ADDRESS);
});


// The server is receiving data 
socket.on('message', function(msg, source) {
    console.log("Data from a Musician has arrived: " + msg + ". Source port: " + source.port);
        
    var musician = JSON.parse(msg);

	// Check if a musician already exists (uuid)
    for (var i = 0; i < musicians.length; i++) {
        if (musician.uuid == musicians[i].uuid) {
            musicians[i].activeSince = musician.activeSince;
            return;
        }
    }
    musicians.push(musician);
});


var tcpServer = net.createServer();

tcpServer.on('connection', function (socket) {
    
    checkInstruments();
    socket.write(JSON.stringify(musicians));
	socket.end();
});

// Check if a musician/instrument is still active
function checkInstruments() {
    for (var i = 0; i < musicians.length; i++) {
        if (moment().diff(musicians[i].activeSince) > protocol.MAX_DELAY) {
            console.log('Mucisian removed : ' + JSON.stringify(musicians[i]));
            musicians.splice(i, 1);
        }
    }
}

// array to save the actives musicians
var musicians = [];
tcpServer.listen(protocol.PORT);
console.log("TCP Server now running on port : " + protocol.PORT);