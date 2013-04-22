// Messenger.js is essentially an IIFE, which returns an object that 
// allows you to bind custom DOM events to custom event handlers.
//
// copyright (c) 2013 By Alexander Ressler

  
    
    
Messenger = ( function(){

    // the home base
    var cloud = document.createElement("div");

    // use the new keyword and this function to register a new event
    function customEvent(trigger) {
        return this.event;
    }
    customEvent.prototype.event = document.createEvent("Event");
    customEvent.prototype.event.initEvent(this.trigger, true, true);
    customEvent.prototype.data = {};


    // store events created by makeEvent
    var events = {}; 
    
    
    return ({
        
        on: function(trigger, handler) {
            console.log(cloud);
            events[trigger] = new customEvent(trigger);
            events[trigger].handler = handler;
            cloud.addEventListener(trigger, handler,false);
        },
        
        off: function(trigger, handler) {
            cloud.removeEventListener(trigger,handler,false);
        },
        
        // fire the event and pass the event handler custom data 
        fire: function(event, t) {
            events[event].data = t; // find a better way to pass data when firing a function
            // call the handler function manually and pass in the data
            events[event].handler.call(this, events[event].data)
            cloud.dispatchEvent(events[event]);
        }       
        
    });    
    
}());


function test(e) {
    console.log("running test function");
    console.log(e)
    console.log(arguments);   
}

Messenger.on('test1', test);
