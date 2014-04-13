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
            postTracking: function (e) {
                var trackingObject = { };
                if (trackingManager.mouse) {
                    trackingObject = {
                        x: e.clientX,
                        y: e.clientY,
                        timeStamp: e.timeStamp,
                        targetId: e.target.id,
                        data: e.target.dataset
                    };
                    trackingWorker.postMessage({'cmd': e.type, 'msg': JSON.stringify(trackingObject)});
                    trackingManager.mouse = false;
                }
            },
            // refactor these to make it more generic with switch case
            eventListeners: function () {
                // bind mouse move event
                var events = [
                    'mousemove',
                    'click',
                    'focus',
                    'blur',
                    'scroll',
                ];

                for (var i = 0; i < events.length; i++) {
                    window.addEventListener(events[i], function (e) {
                        trackingStuffs.postTracking(e);
                    }, true);
                }
            }
        },
        publicParts = {
            init: function () {
                webWorkerStuffs.createTrackingWorker();
                trackingStuffs.eventListeners();
            },
            trackingData: function () { return deleteThisPart.trackingData; }
        };

    return publicParts;
})();

(function () {
    tracking.init();
})();