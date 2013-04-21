// Messenger.js is essentially an IIFE, which returns an object that 
// allows you to bind custom DOM events to custom event handlers.
//
// copyright (c) 2013 By Alexander Ressler

  
    
    
Messenger = ( function(){

    // the home base
    var cloud = document.createElement("div");

    // use the new keyword and this function to register a new event
    var makeEvent = function(trigger) {
        var event = document.createEvent("Event");
        event.initEvent(trigger, true, true);
        return event;
    }
    
    // store events created by makeEvent
    var events = {}; 
    
    
    return ({
        
        on: function(trigger, handler) {  
            events[trigger] = new makeEvent(trigger);            
            cloud.addEventListener(trigger,handler,false);
        },
        
        off: function(trigger, handler) {
            cloud.removeEventListener(trigger,handler,false);
        },
        
        trigger: function(event) {
            cloud.dispatchEvent(events[event]);
        }       
        
    });    
    
}());

