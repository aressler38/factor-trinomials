define(
  [
    "./ft-messenger-central", 
    "./rectangle",
    "./text!../html/templates/number-pad.html"
  ], function(FTMessengerCentral, Rectangle, numberPadTemplate) {


    function run() {
        var rectangle = new Rectangle();
        var brain = new FTMessengerCentral();
        var nextButton      = document.getElementById("next-button");
        nextButton.onclick  = function() {brain.send("randomize"); };
        brain.send("initialize");
    }
    
    //run(); 
    var template=$(numberPadTemplate);    
    $(document.body).append(template);
});
