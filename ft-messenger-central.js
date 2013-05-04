// fg-messenger-central.js coordinates the Messenger with any handles that need to run when 
// custom events are sent. 
//
// copyright (c) 2013 By Alexander Ressler
//
// =========================================================================================




(function() {
    
    var diamond = {
        0:false,
        1:false,
        2:false,
        3:false
    };
    
    function evaluateDiamond(dInput) {
        console.log("you are running evaluateDiamond")
        $.extend(diamond, dInput);
	console.log('the diamond input');
        console.log(diamond);
    }
    
    function guide(msg) {
        console.log("you are logging to ft-guide: "+msg)
    }

    Messenger.on("ft-guide", guide);
    Messenger.on("ft-d-eval", evaluateDiamond);

    
    
}());
