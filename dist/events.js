var rootUrl = window.location.origin;
var app = new Vue({
    el: "#app",
    data: {
        messages: [],
        lastMessage: "",
        score:"",
        standing:"",
        xEvName:"",
        yEvName:"",
        zEvName:"",
        xAccel:"",
        yAccel:"",
        zAccel:""
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
                    this.updateRating(JSON.parse(event.data));
                    this.updateXLog(JSON.parse(event.data));
                    this.updateYLog(JSON.parse(event.data));
                    this.updateZLog(JSON.parse(event.data));
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        },

        updateRating(ev) {
            if (ev.eventName === 'Your Total Score:') {
                this.score = (ev.eventData.message)*100;
                if (this.score >=90) {
                    this.standing = "Perfect";
                } else if (this.score >=76) {
                    this.standing = "Average";
                } else if (this.score >=56){
                    this.standing = "Increase Imminent";
                } else if (this.score <=55){
                    this.standing = "Loss of Coverage";
                }
            }
        },
                    
        // Acceleration Scores
        updateXLog(ev){
            if (ev.eventName === 'Your X Acceleration Score:') {
                this.xEvName = ev.eventName;
                this.xAccel = (ev.eventData.message)*100;
                }
        }, 
        
        updateYLog(ev){
            if (ev.eventName === 'Your Y Acceleration Score:') {
                this.yEvName = ev.eventName;
                this.yAccel = (ev.eventData.message)*100;
                }
        },

        updateZLog(ev){        
        if (ev.eventName === 'Your Z Acceleration Score:') {
            this.zEvName = ev.eventName;
            this.zAccel = (ev.eventData.message)*100;
            }
        },
    }
                
            
})
    
