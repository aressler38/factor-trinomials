define([
        "./var/appMessenger"
],function(appMessenger) {

    /** 
     * @constructor
     */
    function NumberPad() {
        var numpad = document.querySelector(".numpad");
        this.$numpad = $(".numpad");
        var buff = [];
        var that = this;

        /**
         * @public
         * clear buffer
         */
        this.clear = function() {
            while (buff.length) buff.pop();
            return this;
        };

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
            if ($(button).hasClass("clr")) {
                _onclear(event);
                return null;
            }
            else if (buff.length < 5) { 
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
            that.clear();
            return null;
        }

        /**
         * clear the buffer callback
         * @callback
         */
        function _onclear(event) {
            that.clear();
            that.onclear(buff.join(""), buff);
            return null;
        }

        /**
         * handle any dragging of the number pad
         * @callback
         */ 
        function dragHandler(event) {
            //event.preventDefault();
            var cx, cy, x0, y0, x, y;
            if ($(event.target).hasClass("number")) { return null; }
            switch (event.type) {
                case "touchstart":
                    cx = event.touches[0].clientX;
                    cy = event.touches[0].clientY;
                    x0 = that.$numpad.offset().left;
                    y0 = that.$numpad.offset().top;
                    document.addEventListener("touchmove", drag);
                    document.addEventListener("touchend", function() {
                        document.removeEventListener("touchmove", drag);
                        endDrag();
                    });
                    break;
                default:
                    cx = event.pageX;
                    cy = event.pageY;
                    x0 = that.$numpad.offset().left;
                    y0 = that.$numpad.offset().top;
                    document.addEventListener("mousemove", drag);
                    document.addEventListener("mouseup", function() {
                        document.removeEventListener("mousemove", drag);
                        endDrag();
                    });
            }
            that.$numpad.removeClass("transition-top");

            /** @callback */
            function endDrag(event) {
                that.$numpad.addClass("transition-top");
            }

            /** @callback */
            function drag(event) {
                //event.preventDefault();
                //event.stopPropagation();
                switch (event.type) {
                    case "touchmove": 
                        x = event.touches[0].clientX-cx + x0;
                        y = event.touches[0].clientY-cy + y0;
                        break;
                    default: 
                        x = event.pageX-cx + x0;
                        y = event.pageY-cy + y0;
                }
                that.$numpad.css({
                    "left": x,
                    "top": y 
                }); 
            }
        }

        // I don't like unbinding previous handlers like this, but it works for now.
        this.$numpad.off();
        numpad.addEventListener("mousedown", dragHandler);
        numpad.addEventListener("touchstart", dragHandler);
        numpad.addEventListener("mousedown", clickHandler);
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

    NumberPad.prototype.onclear = function(str, array) { };

    NumberPad.prototype.hide = function() {
        this.$numpad.addClass("offscreen");
    };

    NumberPad.prototype.show = function(dims) {
        this.$numpad.removeClass("offscreen");
        if (dims instanceof Array) {
            this.$numpad.css({
                left: dims[0] + "px",
                top: dims[1] + "px"
            });
        }
    };


    NumberPad.prototype.removeClass = function() {
        this.$numpad.removeClass.apply(this.$numpad, arguments);
    };

    NumberPad.prototype.addClass = function() {
        this.$numpad.addClass.apply(this.$numpad, arguments);
    };

    NumberPad.prototype.destroy = function() {
        this.$numpad.off();
        this.onenter = function() { return null; };
        this.onclick = function() { return null; };
    };

    return NumberPad;
});
