var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com

var app = new Vue({
    el: "#app",
    data: {
        blinking_0: false,        // true if device 0 is blinking.
        blinking_1: false,        // true if device 0 is blinking.

        // Lichtschranke Variablen
        counter_0: 0,
        counter_1: 0,
        waitToConfirm: false,
        irAStatus_0: false,
        irBStatus_0: false,
        irAStatus_1: false,
        irBStatus_1: false,
        // add your own variables here ...
    },
    // This function is executed once when the page is loaded.
    mounted: function () {
        this.initSse();
    },
    methods: {
        // Initialise the Event Stream (Server Sent Events)
        // You don't have to change this function
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = rootUrl + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => {
                    this.updateVariables(JSON.parse(event.data));
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        },
        // react on events: update the variables to be displayed
        updateVariables(ev) {

            // Event "buttonStateChanged"
            if (ev.eventName === "buttonStateChanged") {
                this.buttonPressCounter = ev.eventData.counter;
                if (ev.eventData.message === "pressed") {
                    this.buttonsSync = ev.eventData.pressedSync;
                }
            }
            // Event "motionDetected"
            else if (ev.eventName === "motionDetected") {
                if (ev.eventData.message === "Entry") {
                    if (ev.deviceNumber === 0) {
                        this.irAStatus_0 = true;
                    }
                    else if (ev.deviceNumber === 1) {
                        this.irAStatus_1 = true;
                    }
                }
                if (ev.eventData.message === "Exit") {
                    if (ev.deviceNumber === 0) {
                        this.irBStatus_0 = false;
                    }
                    else if (ev.deviceNumber === 1) {
                        this.irBStatus_1 = false;
                    }
                }
            }
        },
        // call the function "blinkRed" in your backend
        blinkRed: function (nr) {
            var duration = 2000; // blinking duration in milliseconds
            axios.post(rootUrl + "/api/device/" + nr + "/function/blinkRed", { arg: duration })
                .then(response => {
                    // Handle the response from the server
                    console.log(response.data); // we could to something meaningful with the return value here ... 
                })
                .catch(error => {
                    alert("Could not call the function 'blinkRed' of device number " + nr + ".\n\n" + error)
                })
        },
        // get the value of the variable "counter" on the device with number "nr" from your backend
        getCounter: function (nr) {
            axios.get(rootUrl + "/api/device/" + nr + "/variable/counter")
                .then(response => {
                    // Handle the response from the server
                    var counter = response.data.result;
                    if (nr === 0) {
                        this.counter_0 = counter;
                    }
                    else if (nr === 1) {
                        this.counter_1 = counter;
                    }
                    else {
                        console.log("unknown device number: " + nr);
                    }
                })
                .catch(error => {
                    alert("Could not read the button state of device number " + nr + ".\n\n" + error)
                })
        }
    }
})