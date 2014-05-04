define(
  [
    "./ft-messenger-central", 
    "./rectangle",
    "./templates", 
    "./var/primeFactors"
  ], function(FTMessengerCentral, Rectangle, templates, primeFactors) {

    var containerID = "factor-trinomials";
    var app = {};

    app.containerID = containerID;
    app.setup = setup;
    app.run = run;

    /** 
     * Prepare the DOM.
     */
    function setup() {
        Math.primeFactors = primeFactors;
        var $con = $(document.getElementById(app.containerID));
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

        // events
        window.addEventListener("resize", function() {
            $con.css({
                width: window.innerWidth,
                height: window.innerHeight
            });
        });

        return null;
    }


    function run() {
        var rectangle       = new Rectangle();
        var brain           = new FTMessengerCentral();
        var nextButton      = document.getElementById("next-button");
        nextButton.onclick  = function() {brain.send("randomize"); };
        brain.send("randomize");
        return null;
    }
    


    window.app = app;
    return app;
});
