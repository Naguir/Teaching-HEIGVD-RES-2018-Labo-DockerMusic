var protocol = require('./protocol');

var dgram = require('dgram');

var uuid = require('uuid');

var moment = require('moment');

var socket = dgram.createSocket('udp4');

const SOUNDS = {
    piano: "ti-ta-ti",
    trumpet: "pouet",
    flute: "trulu",
    violin: "gzi-gzi",
    drum: "boum-boum"
};

var instrument = process.argv[2];

if(instrument === undefined){
    console.log("Error : instrument undefined.\nplease choose between : \n -> Piano\n -> Trumpet\n -> Flute\n -> Violin\n -> Drum");
    process.exit(1);
}

console.log("Messages will be sent to : " + protocol.MULTICAST_ADDRESS + ":" + protocol.PORT);

// Every 1 sec we play music..
setInterval(sendMessage, 1000);

var json = {
    uuid: uuid(),
    instrument: process.argv[2]
};

// it will broadcast the messages
function sendMessage() {
    json.activeSince = moment();
    
    var message = JSON.stringify(json);
    
    console.log('Music ' + SOUNDS[json.instrument] + ' message : ' + message);

    socket.send(message, 0, message.length, protocol.PORT, protocol.MULTICAST_ADDRESS, function (err, bytes) {
        if (err) throw err;
    });
}