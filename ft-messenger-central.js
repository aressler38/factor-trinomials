// fg-messenger-central.js coordinates the Messenger with any handles that need to run when 
// custom events are sent. 
//
// copyright (c) 2013 By Alexander Ressler
//
// ================================================================================================




(function() {
    
    var diamond = {
        1:false,
        2:false,
        3:false,
        4:false
    };
    
    function evaluateDiamond(dInput) {
        $.extend(diamond, dInput);
    }
    
    function logger(msg) {
        console.log("you are logging to ft-guide: "+msg)
    }
    function toast(e) {
        console.log('you can not fire logger, you are firing toast '+e)
    }
    
    Messenger.on("ft-guide", logger);
    Messenger.on("ft-d-eval", toast);
    
}());