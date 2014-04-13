console.log('created worker');  // confirm started

var workerBee = workerBee || (function () {
    var bigTrackObj = [],
        privateParts = {
            setTrackObject: function () {}
        },
        publicParts = {
            addTracking: function (eventType, trackingObj) {
                var trackObj = {
                    type: eventType,
                    details: {
                        timeStamp: trackingObj.timeStamp,
                        mousePosition: {
                            x: trackingObj.x,
                            y: trackingObj.y
                        },
                        targetId: trackingObj.targetId,
                        dataset: trackingObj.data
                    }
                };
                bigTrackObj.push(trackObj);

                if (eventType === 'mousemove') {
                    setTimeout(function () {
                        self.postMessage({trigger: true, data: bigTrackObj});
                        socket.emit('trackingData', bigTrackObj);
                        clearTimeout();
                    }, 100);
                } else {
                    self.postMessage({trigger: true, data: bigTrackObj});
                    socket.emit('trackingData', bigTrackObj);
                }
            }
        };

    return publicParts;
})();

// listener
self.addEventListener('message', function (e) {
    workerBee.addTracking(e.data.cmd, JSON.parse(e.data.msg));
}, false);

importScripts('http://localhost:3000/socket.io/socket.io.js');
var socket = new io.connect('ws://localhost:3000');

// Add a connect listener
socket.on('connect',function() {
    console.log('Client has connected to the server!');
});
