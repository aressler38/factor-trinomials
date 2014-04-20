define(["ft-messenger-central", "rectangle"], function(FTMessengerCentral, Rectangle) {


    function run() {
        var rectangle = new Rectangle();
        var brain = new FTMessengerCentral();
        var nextButton      = document.getElementById("next-button");
        nextButton.onclick  = function() {brain.send("randomize"); };
        brain.send("initialize");
    }

    run();
});
