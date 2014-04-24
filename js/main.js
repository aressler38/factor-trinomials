define(
  [
    "./ft-messenger-central", 
    "./rectangle",
    "./templates"
  ], function(FTMessengerCentral, Rectangle, templates) {

    var containerID = "factor-trinomials";


    function setup() {
        var $con = $(document.getElementById(containerID));
        //var $header     = $(templates.header);
        var $trinomial  = $(templates.trinomial);
        var $rectangle  = $(templates.rectangle);
        var $diamond    = $(templates.diamond);
        var $numberPad  = $(templates.numberPad);
        var $finalContainer = $(templates.finalContainer);

        //$con.append($header); 
        $con.append($trinomial); 
        $con.append($rectangle); 
        $con.append($diamond); 
        $con.append($finalContainer);

        $con.append($numberPad);

        $con.css({
            width: window.innerWidth,
            height: window.innerHeight
        });


    }


    function run() {
        var rectangle       = new Rectangle();
        var brain           = new FTMessengerCentral();
        var nextButton      = document.getElementById("next-button");
        nextButton.onclick  = function() {brain.send("randomize"); };
        brain.send("initialize");
    }
    
    setup();
    run(); 



});
