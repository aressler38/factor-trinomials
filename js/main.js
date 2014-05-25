define(
  [
    "./ft-messenger-central", 
    "./rectangle",
    "./templates", 
    "./var/primeFactors",
    "./var/appMessenger",
    "./tutorial"
  ], function(FTMessengerCentral, Rectangle, templates, primeFactors, appMessenger, Tutorial) {

    var containerID = "factor-trinomials";
    var app = {};

    app.containerID = containerID;
    app.setup = setup;
    app.run = run;


    function tutorialSetup() {
        var tutorialMode = 0; // 0: off, 1: on
        var tutorialStart = document.createElement("div");
        var tutorial;
        tutorialStart.onclick = function() {
            if (!tutorialMode) {
                tutorial = new Tutorial({ });
                tutorial.insert();
            }
            else {
                tutorial.remove();
            }
            tutorialMode = (tutorialMode) ? 0 : 1;
            return null;
        };
        document.getElementById("factor-trinomials").appendChild(tutorialStart);
        tutorialStart.setAttribute("class", "tutorial nav-button");
        tutorialStart.innerHTML = "Tutorial";
    }


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
        var body = document.querySelector("body");

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

        tutorialSetup();

        if (window.isMobile) {
            $(".numpad").css({ padding: "15px" });
        }
       

        // events
        window.addEventListener("resize", function() {
            body.style.height = window.innerHeight + "px";
            body.style.width = window.innerWidth + "px";
            $con.css({
                width: $("body").width(),
                height: $("body").height()
            });
        });

        $(body).bind("touchmove", function(event) {
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
