define(
[
],function() {

    function Hints() {
        var hintButton;
        var state = 0; // 1:on, 0:off
        var MAX_flashCount = 4;
        var flashLag = 500;
        var now = function() {return window.performance.now();};
        var time = now();
        var register = null;

        function clickHandler(event) {
            var className = event.target.getAttribute("class") || "";

            if (className.match(/fta|ftb|ftc|ftd/)) {
                console.log("match");
                flash("."+className, "red");
                
            }
            else if (false) {

            }
            else {
                console.log("Not a hint zone");

            }

        }

        function flash(selector, color) {
            var flashCount = MAX_flashCount;
            console.log('start flash'); 
            var selector = selector;
            var color = color;
            function _flash() {
                if ( (now() - time > flashLag) && flashCount ) {
                    if (flashCount%2) {
                        console.log('remove class');
                        $(selector).removeClass("flash "+color);
                    }
                    else {
                        console.log('add class');
                        $(selector).addClass("flash "+color);
                    }
                    flashCount--;
                    time = now();
                    return window.requestAnimationFrame(_flash);
                }
                else if (!flashCount) {
                    flashCount = MAX_flashCount;
                    return null;
                }
                else {
                    return window.requestAnimationFrame(_flash);
                }
            }
            return window.requestAnimationFrame(_flash);
        }

        function on() {
            state = 1;
            $(hintButton).addClass("on");
            document.addEventListener("mousedown", clickHandler);
        }
        function off() {
            $(hintButton).removeClass("on");
            state = 0;
            document.removeEventListener("mousedown", clickHandler);
        }
        function makeButton() {
            hintButton = document.createElement("div");
            hintButton.setAttribute("class", "hint-button");
            // toggle on/off state
            hintButton.addEventListener("click", function(event) {
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
            document.querySelector(selector).appendChild(hintButton);
        } 


        makeButton();


        return {
            on    : on,
            off   : off,
            render: render
        }
    }

    return Hints;

});
