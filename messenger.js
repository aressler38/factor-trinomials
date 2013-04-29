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
    }
    //customEvent.prototype.event = document.createEvent("Event");
    //customEvent.prototype.event.initEvent(this.trigger, true, true);
    //customEvent.prototype.data = {};

    // store events created by makeEvent
    var events = {}; 
    
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
            if (events[event]) {
                    events[event].data = dataThru; // find a better way to pass data when firing a function                        
            }
            // call the handler function manually and pass in the data
            if (events[event] && events[event].handler) {
                events[event].handler((events[event].data));
            }
        }       
    });    
}());
