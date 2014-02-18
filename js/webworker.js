console.log('created worker');  // confirm started

var workerBee = workerBee || (function () {
    var trackObj = {
            mouseMove: []
        },
        privateParts = {
            setTrackObject: function () {}
        },
        publicParts = {
            addMouseTracking: function (trackingObj) {
                var d = new Date();
                var timeStap = d.getTime();

                var mouseMoveObj = {
                    timeStamp: timeStap,
                    mousePosition: {
                        x: trackingObj.mouse.x,
                        y: trackingObj.mouse.y
                    }
                };
                trackObj.mouseMove.push(mouseMoveObj);
                setTimeout(function () {
                    self.postMessage({trigger: true, data: trackObj});
                    clearTimeout();
                }, 100);
            }
        };

    return publicParts;
})();

// listener
self.addEventListener('message', function (e) {
    workerBee.addMouseTracking(JSON.parse(e.data));
}, false);