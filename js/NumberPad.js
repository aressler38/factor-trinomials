define([
        "./var/appMessenger"
        
],function(appMessenger) {
    /** 
     * @constructor
     */
    function NumberPad() {
        this.$numpad = $(".numpad");
        var buff = [];

        /**
         * click event handler
         * @callback 
         */
        function clickHandler(event) {
            var button = event.target;
            var content = button.innerHTML;

            if ($(button).hasClass("operator")) {
                appMessenger.send("numpadSubmit", buff)
                while (buff.length) buff.pop(); //clear buffer
            }
            buff.push(content);
            console.log(buff);
            console.log(buff.join(""));
        }

        // I don't like unbinding previous handlers like this, but it works for now.
        this.$numpad.off().on("click", clickHandler);
    }


    NumberPad.prototype.hide = function() {
        this.$numpad.addClass("hide");
    };

    NumberPad.prototype.show = function() {
        this.$numpad.removeClass("hide");
    };
    NumberPad.prototype.removeClass = function() {
        this.$numpad.removeClass.apply(this.$numpad, arguments);
    };
    NumberPad.prototype.addClass = function() {
        this.$numpad.addClass.apply(this.$numpad, arguments);
    };


    return NumberPad;
});
