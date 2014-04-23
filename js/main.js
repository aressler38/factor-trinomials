define(
  [
    "./ft-messenger-central", 
    "./rectangle",
    "./templates"
  ], function(FTMessengerCentral, Rectangle, templates) {


    function run() {
        var rectangle = new Rectangle();
        var brain = new FTMessengerCentral();
        var nextButton      = document.getElementById("next-button");
        nextButton.onclick  = function() {brain.send("randomize"); };
        brain.send("initialize");
    }
    
    run(); 


    //TODO: REMOVE ME!!!!!
    var template = $(templates.numberPadTemplate);    
    $(document.body).append(template);
});
