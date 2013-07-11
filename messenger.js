// Messenger.js is essentially an IIFE, which returns an object that 
// allows you to bind custom DOM events to custom event handlers.
//
// copyright (c) 2013 By Alexander Ressler
    
Messenger = (function(){

    // the home base
    var cloud = document.createElement("div");

    // use the new keyword and this function to register a new event
    function customEvent(trigger) {
        this.event = document.createEvent("Event");
        this.event.initEvent(this.trigger, true, true);
        this.data = {};
        return this.event;
    };

    Array.prototype.popFirst = function () {
        this.reverse();
        this.pop();
        this.reverse();
        return this;
    };
    
    var events = {}; // store events created by makeEvent
    
    return ({
        on: function(trigger, handler) {
            var handle = handler;
            events[trigger] = new customEvent(trigger); // bind the trigger to a method
            events[trigger].handler = handle;
            cloud.addEventListener(trigger, handle, false);
        },
        
        off: function(trigger, handler) {
            cloud.removeEventListener(trigger, handler, false);
            events[trigger]={data:null, handler:function(){}};
        },
        
        // fire the event and pass the event handler custom data 
        send: function(event, dataThru) {
            if (dataThru) {
                var argLen = arguments.length;
                var dataThrus = new Array(argLen);
                for (var i=0; i<argLen; i++) {
                    dataThrus[i] = arguments[i];
                }
                dataThrus.popFirst();
            }
            // if the event is regestered, then store the incomming dataThru
            if (events[event]) {
                events[event].data = dataThrus;                    
            }
            // call the handler function manually and pass in the data
            // return the result
            if (events[event] && events[event].handler) {
                return events[event].handler((events[event].data));
            }
        }       
    });    
}());
