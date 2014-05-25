define(
[
    "./var/appMessenger"
],function(appMessenger) {

    function Hints() {
        var $hintContainer = $(".hint-container");
        var hintButton;
        var hintButtonWrapper;
        var state = 0; // 1:on, 0:off NOT APP STATE
        var MAX_flashCount = 4;
        var flashLag = 500;
        var HINT_TIMEOUT = (MAX_flashCount * flashLag)<<1;
        var now = function() {return window.performance.now();};
        var time = now();
        var register = null;
        var flashQueue = [];
        var MAX_flashQueue = 1;
        var APP_STATE = null;

        function getDiamond(number) {
            return document.querySelector("span[data-diamond=\""+number+"\"]");
        }
        function getDiamondInnerContent(number) {
            return getDiamond(number).querySelector("span").innerHTML;
        }
        function numberCleanup(n) {
            return (n===1) ? "" : (n===-1) ? "-" : n;
        }

        function getAppState() {
            return (appMessenger.send("getState", function(s) { APP_STATE = s; }), APP_STATE);
        }

        function flashNextMissingDiamondPart() {
            appMessenger.send("getParameters", function(p) {
                [].splice.call(p).forEach(function(x,i,a) {
                    a[i] = numberCleanup(x);
                });
                register = [
                    document.querySelector(".leading-term").innerHTML,
                    document.querySelector(".middle-term").innerHTML,
                    document.querySelector(".constant-term").innerHTML
                ];
                // start with 1, then go to 3, and finish with 2 & 4;
                if (getDiamondInnerContent(1) === "") {
                    hintText("First, put the middle term ("+p[1]+"x) in the flashing diamond.");
                    flash([getDiamond(1), ".middle-term"], "blue");
                } 
                else if (getDiamondInnerContent(3) === "") {
                    hintText("The <u>product</u> of ("+register[0]+") and ("+register[2]+") goes in the flashing diamond.");
                    flash([getDiamond(3), ".leading-term", ".constant-term"], "blue");
                }
                else if (getDiamondInnerContent(2) === "" || getDiamondInnerContent(4) === "") {
                    hintText("The sum of the two side diamonds equals ("+register[1]+")", function() {
                        hintText("<u>AND</u> The product of the side diamonds equals ("+(p[0]*p[2])+"x<span class=\"exp\">2</span>&nbsp;).");
                    });
                    flash([getDiamond(2), getDiamond(4), getDiamond(1)], "blue", function() {
                        flash([getDiamond(2), getDiamond(4), getDiamond(3)], "blue");
                    });

                }
            });
        }

        function getParentsClasses(target) {
            var classes = " ";
            classes += (target.getAttribute("class")) ? (target.getAttribute("class")) : "";
            if (target.parentElement !== null) {
                classes += getParentsClasses(target.parentElement);
            }
            return classes;
        }

        function clickHandler(event) {
            if (flashQueue.length) { return null; }
            var className = getParentsClasses(event.target);

            appMessenger.send("ft-click-state", getAppState());

            if (typeof event.target.dataset.diamond === "string") {
                flashNextMissingDiamondPart();
                return null;
            }

            // Rectangle boxes
            if (className.match(/fta|ftb|ftc|ftd|ftx1|ftx2|ftk1|ftk2/)) {
                if (1===getAppState()) {
                    flashNextMissingDiamondPart();
                    return null;
                }
                // filter on particular class name
                if (className.match(/ftx1/)) {
                    flash(".fta, .ftx1, .ftb", "blue");
                    hintText("The Greatest Common Factor of ("+$(".fta").html()+") and ("+$(".ftb").html()+") goes in this square.");
                }
                else if (className.match(/ftx2/)) {
                    flash(".ftx1, .ftx2, .fta", "blue");
                    hintText("This value times the GCF of the top row equals ("+$(".fta").html()+")");

                }
                else if (className.match(/fta/)) { 
                    flash(".fta, .ftx2, .ftx1", "blue");
                }
                else if (className.match(/ftb|ftk2/)) {
                    flash(".ftb, .ftk2, .ftx1", "blue");
                    hintText("The product of the left-top and the top-right squares equals ("+$(".ftb").html()+")");
                }
                else if (className.match(/ftc|ftk1|ftx2/)) {
                    flash(".ftc, .ftk1, .ftx2", "blue");
                    hintText("The product of the left-bottom and the top-left squares equals ("+$(".ftc").html()+")");
                }
                else {
                    flash(".ftd, .ftk1, .ftk2, .ft-trinomial-equation .c", "blue");
                    hintText("This is the square for the constant term.");
                }
            }
            else if (false) {

            }
            else {
                console.log("Not a hint zone");
            }
        }

        function flash(selector, color, callback) {
            function handleClasses(ar) {
                if (selector instanceof Array) {
                    selector.forEach(function(s) {
                        $(s)[ar+"Class"]("flash "+color); 
                    });
                }
                else { $(selector)[ar+"Class"]("flash "+color); }
            }
            var flashCount = MAX_flashCount;
            if (flashQueue.length >= MAX_flashQueue) {
                return null;
            }
            flashQueue.push(1);
            function _flash() {
                if ( (now() - time > flashLag) && flashCount ) {
                    if (flashCount%2) {
                        handleClasses("remove");
                    }
                    else {
                        handleClasses("add");
                    }
                    flashCount--;
                    time = now();
                    return window.requestAnimationFrame(_flash);
                }
                else if (!flashCount) {
                    flashQueue.pop();
                    if (typeof callback === "function") { callback(); }
                    return null;
                }
                else {
                    return window.requestAnimationFrame(_flash);
                }
            }
            return window.requestAnimationFrame(_flash);
        }

        function hintText(hint, callback) {
            $hintContainer.addClass("show");
            $hintContainer.find(".hint").html(hint);
            window.setTimeout(function() {
                if (!flashQueue.length) {
                    $hintContainer.removeClass("show");
                }
                if (typeof callback === "function") {
                    callback();
                }
            }, HINT_TIMEOUT);
        }
        function on() {
            state = 1;
            $(hintButton).addClass("on");
            document.addEventListener("mousedown", clickHandler);
            appMessenger.send("getModel", function(m) {
                m.set("hints", "on");
            });
        }
        function off() {
            $(hintButton).removeClass("on");
            state = 0;
            document.removeEventListener("mousedown", clickHandler);
            appMessenger.send("getModel", function(m) {
                m.set("hints", "off");
            });
        }
        function makeButton() {
            hintButtonWrapper = document.createElement("div");
            hintButton = document.createElement("div");
            
            hintButtonWrapper.setAttribute("class", "hint-button-wrapper");
            hintButton.setAttribute("class", "hint-button");
            // toggle on/off state
            hintButton.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (state===1) {
                    state = 0;
                    off();
                }
                else {
                    state = 1;
                    on();
                }
            });
        }
        function render(selector) {
            hintButtonWrapper.appendChild(hintButton);
            document.querySelector(selector).appendChild(hintButtonWrapper);
        } 


        makeButton();


        return {
            on    : on,
            off   : off,
            render: render
        };
    }

    return Hints;

});
