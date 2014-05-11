define(
[
],function() {

    function Hints() {
        var $hintContainer = $(".hint-container");
        var hintButton;
        var hintButtonWrapper;
        var state = 0; // 1:on, 0:off
        var MAX_flashCount = 4;
        var flashLag = 500;
        var HINT_TIMEOUT = (MAX_flashCount * flashLag)<<1;
        var now = function() {return window.performance.now();};
        var time = now();
        var register = null;
        var flashQueue = [];
        var MAX_flashQueue = 1;


        function clickHandler(event) {
            if (flashQueue.length) { return null; }
            var className = event.target.getAttribute("class") || "";
            // Rectangle boxes
            if (className.match(/fta|ftb|ftc|ftd/)) {
                if (className.match(/fta/)) {
                    flash("."+className+", .ftx1, .ftx2, .ft-trinomial-equation .leading-term", "");
                    hintText("This squre is the product square; find the two factors.");
                }
                else if (className.match(/ftb/)) {
                    flash("."+className+", .ftk2, .ftx1", "");
                    hintText("This square is one of the middle terms.");
                }
                else if (className.match(/ftc/)) {
                    flash("."+className+", .ftk1, .ftx2", "");
                    hintText("This square is one of the middle terms.");
                }
                else {
                    flash("."+className+", .ftk1, .ftk2, .ft-trinomial-equation .c", "");
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
            var flashCount = MAX_flashCount;
            if (flashQueue.length >= MAX_flashQueue) {
                return null;
            }
            flashQueue.push(1);
            function _flash() {
                if ( (now() - time > flashLag) && flashCount ) {
                    if (flashCount%2) {
                        $(selector).removeClass("flash "+color);
                    }
                    else {
                        $(selector).addClass("flash "+color);
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

        function hintText(hint) {
            $hintContainer.addClass("show");
            $hintContainer.find(".hint").html(hint);
            window.setTimeout(function() {
                if (!flashQueue.length) {
                    $hintContainer.removeClass("show");
                }
            }, HINT_TIMEOUT);
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
