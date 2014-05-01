define([
        "./var/appMessenger"
],function(appMessenger) {

    /** 
     * @constructor
     */
    function NumberPad() {
        this.$numpad = $(".numpad");
        var buff = [];
        var that = this;

        /**
         * click event handler
         * @callback 
         */
        function clickHandler(event) {
            var button = event.target;
            var content = button.innerHTML;
            // only capture number elements
            if (!$(button).hasClass("number")) { return null; }
            // If you clicked enter, then call onenter, clear the buffer, and return. 
            if ($(button).hasClass("operator")) {
                _onenter(event);
                return null;
            }
            else { 
                buff.push(content); 
                that.onclick(buff.join(""), buff);
            }
        }

        /** 
         * onenter callback
         * @callback
         * @private
         */
        function _onenter(event) {
            that.onenter(buff.join(""), buff);
            that.hide();
            while (buff.length) buff.pop(); //clear buffer
            return null;
        }

        /**
         * handle any dragging of the number pad
         * @callback
         */ 
        function dragHandler(event) {
            if ($(event.target).hasClass("number")) { return null; }
            var cx = event.clientX;
            var cy = event.clientY;
            var x0 = that.$numpad.offset().left;
            var y0 = that.$numpad.offset().top;
            that.$numpad.removeClass("transition-top");

            $(document).on("mousemove", drag);
            $(document).on("mouseup", function() {
                $(document).off("mousemove", drag);
                that.$numpad.addClass("transition-top");
            });    
            /** @callback */
            function drag(event) {
                that.$numpad.css({
                    "top": event.clientY-cy + y0,
                    "left": event.clientX-cx + x0 
                }); 
            }
        }


        // I don't like unbinding previous handlers like this, but it works for now.
        this.$numpad.off();
        this.$numpad.on("click", clickHandler);
        this.$numpad.on("mousedown", dragHandler);
    }

    /**
     * Called when the enter button is clicked
     * @public 
     * @method
     * @param str - string representing the buttons pressed that are in the current buffer
     * @param array - array representing the buttons that were pressed.
     */
    NumberPad.prototype.onenter = function(str, array) { };

    /**
     * called when a button other than enter is clicked
     * @public
     * @method
     * @param str - string representing the buttons pressed that are in the current buffer
     * @param array - array representing the buttons that were pressed.
     */
    NumberPad.prototype.onclick = function(str, array) { };

    NumberPad.prototype.hide = function() {
        this.$numpad.addClass("offscreen");
    };

    NumberPad.prototype.show = function() {
        this.$numpad.removeClass("hide");
        this.$numpad.removeClass("offscreen");
    };

    NumberPad.prototype.removeClass = function() {
        this.$numpad.removeClass.apply(this.$numpad, arguments);
    };

    NumberPad.prototype.addClass = function() {
        this.$numpad.addClass.apply(this.$numpad, arguments);
    };

    return NumberPad;
});
