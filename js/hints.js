define(
[
],function() {

    function Hints() {
        var hintButton;
        var hintButtonWrapper;
        var state = 0; // 1:on, 0:off
        var MAX_flashCount = 4;
        var flashLag = 500;
        var now = function() {return window.performance.now();};
        var time = now();
        var register = null;
        var flashQueue = [];
        var MAX_flashQueue = 5;

        function clickHandler(event) {
            var className = event.target.getAttribute("class") || "";

            if (className.match(/fta|ftb|ftc|ftd/)) {
                console.log("match");
                flash("."+className+", .ftx1, .ftx2", "");
                
            }
            else if (false) {

            }
            else {
                console.log("Not a hint zone");

            }

        }

        function flash(selector, color, callback) {
            var flashCount = MAX_flashCount;
            console.log('start flash'); 
            //var selector = selector;
            //var color = color;
            if (flashQueue.length >= MAX_flashQueue) {
                console.log("MAX QUEUE");
                return null;
            }
            flashQueue.push(1);
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
                    //flashCount = MAX_flashCount;
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
            hintButtonWrapper = document.createElement("div");
            hintButton = document.createElement("div");
            
            hintButtonWrapper.setAttribute("class", "hint-button-wrapper");
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
