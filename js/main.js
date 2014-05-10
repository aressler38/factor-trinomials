define(
  [
    "./ft-messenger-central", 
    "./rectangle",
    "./templates", 
    "./var/primeFactors",
    "./hints"
  ], function(FTMessengerCentral, Rectangle, templates, primeFactors, Hints) {

    var containerID = "factor-trinomials";
    var app = {};

    app.containerID = containerID;
    app.setup = setup;
    app.run = run;

    /** 
     * Prepare the DOM.
     */
    function setup() {

        // Fixes a bug in android browser: the touchmove event only fires once unless
        // preventDefault is called... lame...
        document.addEventListener("touchmove", function(event) {
            if (window.navigator.userAgent.match(/Android/i)) {
                event.preventDefault();
            }
        });

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
        $con.append($("<hr class='hr-divider'>"));
        $con.append($finalContainer);
        $con.append($numberPad);
        $con.css({
            width: window.innerWidth,
            height: window.innerHeight
        });

        var hints = new Hints();
        hints.render("#factor-trinomials");
        hints.on();

        if (window.isMobile) {
            $(".numpad").css({ padding: "15px" });
        }

        var body = document.querySelector("body");

        // events
        window.addEventListener("resize", function() {
            body.style.height = window.innerHeight;
            body.style.width = window.innerWidth;

            $con.css({
                width: $("body").width(),
                height: $("body").height()
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
    

    window.isMobile = (function(a){return /Mobile|Android|BlackBerry/.test(a);})(navigator.userAgent||navigator.vendor||window.opera);


    window.app = app;
    return app;
});
