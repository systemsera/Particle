
var app = new Vue({
    el: "#app",
    data: {
        messages: [],
        lastMessage: "",
        xEvName:"",
        yEvName:"",
        zEvName:"",
        xAccel:"",
        yAccel:"",
        zAccel:"",

    },
    mounted: function () {
        this.initSse();
    },
    methods: {
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = window.location.origin + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => { 
                    this.messages.push(event.data);
                    this.lastMessage = event.data;
                    this.xEvName = event.data.xEvName;
                    this.xAccel = event.xAccel;
                    this.yAccel = event.data;
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        }
    }
})