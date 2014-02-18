var tracking = tracking || (function () {
    'use strict';
    var trackingWorker,
        trackingManager = {
            mouse: true
        },

        // delete all of this... just for display
        deleteThisPart = {
            trackingData: { },
            showData: function (data) {
                // won't need to store this on the client... remove
                // just for checking data
                this.trackingData = data;

                // shitty temp code
                var latestLine = data.mouseMove[data.mouseMove.length-1];
                document.getElementById('data').innerHTML =
                    'Time: ' + latestLine.timeStamp
                    + ', Mouse x: ' + latestLine.mousePosition.x
                    + ', Mouse y: ' + latestLine.mousePosition.y
                    + '<br />';
                // shitty temp code end
            }
        },
        webWorkerStuffs = {
            createTrackingWorker: function () {
                if (typeof (Worker) !== undefined) {
                    trackingWorker = new Worker('/js/webworker.js');

                    trackingWorker.addEventListener('message', function (e) {

                        deleteThisPart.showData(e.data.data); // TODO: delete this line

                        trackingManager.mouse = e.data.trigger;
                    }, false);
                }
            },
        },
        trackingStuffs = {
            trackMouseMove: function () {
                window.addEventListener('mousemove', function (e) {
                    var trackingObject = { };
                    if (trackingManager.mouse) {
                        trackingObject.mouse = {
                            x: e.clientX,
                            y: e.clientY
                        };
                        trackingWorker.postMessage(JSON.stringify(trackingObject));
                        trackingManager.mouse = false;
                    }
                }, false);
            }
        },
        publicParts = {
            init: function () {
                webWorkerStuffs.createTrackingWorker();
                trackingStuffs.trackMouseMove();
            },
            trackingData: function () { return trackingData; }
        };

    return publicParts;
})();

(function () {
    tracking.init();
})();