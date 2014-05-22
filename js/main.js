define(
  [
    "./ft-messenger-central", 
    "./rectangle",
    "./templates", 
    "./var/primeFactors",
    "./var/appMessenger"
  ], function(FTMessengerCentral, Rectangle, templates, primeFactors, appMessenger) {

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
        var $trinomial  = $(templates.trinomial);
        var $hints      = $(templates.hints);
        var $rectangle  = $(templates.rectangle);
        var $diamond    = $(templates.diamond);
        var $numberPad  = $(templates.numberPad);
        var body;

        $con.append($trinomial); 
        $con.append($hints); 
        $con.append($rectangle); 
        $con.append($diamond); 
        $con.append($("<hr class='hr-divider'>"));
        $con.append($numberPad);
        $con.css({
            width: window.innerWidth,
            height: window.innerHeight
        });


        if (window.isMobile) {
            $(".numpad").css({ padding: "15px" });
        }

        body = document.querySelector("body");

        // events
        window.addEventListener("resize", function() {
            body.style.height = window.innerHeight + "px";
            body.style.width = window.innerWidth + "px";
            $con.css({
                width: $("body").width(),
                height: $("body").height()
            });
        });

        $("body").bind("touchmove", function(event) {
            event.preventDefault();
        });

        return null;
    }


    function run() {
        var rectangle       = new Rectangle();
        var brain           = new FTMessengerCentral();
        brain.send("randomize");
        return null;
    }
    

    window.isMobile = (function(a){return /Mobile|Android|BlackBerry/.test(a);})(navigator.userAgent||navigator.vendor||window.opera);

    window.onunload = function() {

        appMessenger.send("getModel", function(m) {
            m.write();
        });
    };

    window.app = app;
    return app;
});
