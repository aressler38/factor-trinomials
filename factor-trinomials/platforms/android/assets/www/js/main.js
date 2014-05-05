(function( global, factory ) {
    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = global.document ?
            factory( global, true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( "need a window + document" );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// messenger.js is essentially an IIFE, which returns an object that 
// allows you to bind custom DOM events to custom event handlers.
//
// licensed under Creative Commons (CC-BY) 2013 by Alexander Ressler.
    
    var Messenger = function() {
        String.prototype.hashCode = function(){
            var hash = 0, i, char, l;
            if (this.length === 0) return hash;
            for (i = 0, l = this.length; i < l; i++) {
                char  = this.charCodeAt(i);
                hash  = ((hash<<5)-hash)+char;
                hash |= 0; // Convert to 32bit integer
            }
            return String(hash);
        };

        function customEvent(trigger) {
            this.event = document.createEvent("Event");
            this.event.initEvent(this.trigger, true, true);
            this.data = {};
            return this.event;
        };

        var events = {}; // store events created by makeEvent

        var _m = {
            on: function(trigger, handler, context) {
                if (typeof handler !== "function") {throw new Error("Messenger can't bind an undefined method");}
                if (!events[trigger]) {
                    events[trigger] = new customEvent(trigger); // bind the trigger to a method
                    events[trigger].handlers = {};
                }
                events[trigger].handlers[handler.toString().hashCode()] = handler;
                events[trigger].handlers[handler.toString().hashCode()].context = context;
            },
            off: function(trigger, handler) {
                delete events[trigger].handlers[handler.toString().hashCode()];
            },
            allOff: function(trigger) {
                delete events[trigger];
            },
            // fire the event and pass the event handler custom data
            send: function(event, dataThru) {
                var result;
                if (typeof dataThru !== "undefined") {
                    var argLen = arguments.length;
                    var dataThrus = new Array(argLen);
                    for (var i=0; i<argLen; i++) {
                        dataThrus[i] = arguments[i];
                    }
                    dataThrus.shift();
                }
                if (events[event]) {
                        events[event].data = dataThrus;
                }
                // call the handler function manually and pass in the data
                if (events[event] && events[event].handlers) {
                    for (var handle in events[event].handlers) {
                        var context = events[event].handlers[handle].context;
                        if (context) {
                            result = (function() {
                                return events[event].handlers[handle].apply(context, events[event].data);
                            }());
                        }
                        else {
                            result = (function() {
                                return events[event].handlers[handle].apply(this, events[event].data);
                            }());
                        }
                    }
                    return result; // returns the last item in the event handler stack. 
                }
            },
            trigger: function() {_m.send.apply(this, arguments)}
        };
        return _m;
    };
var appMessenger = new Messenger();

var ifOneOrNegOne = function ifOneOrNegOne(x, showOne) {
        if (x === 1) {
            if (showOne) return "+ 1";
            else return "+ ";
        }
        if (x === -1) {
            if (showOne) return "- 1";
            else return "- ";
        }
        // otherwise return 
        return x;
    };

var prettifySign = function prettifySign(x) {
        var _x = null;
        if (typeof x === "string") {
            _x = x.replace(/ /g, ''); // remove whitespace
            _x = parseInt(_x);
            if (Number.isNaN(_x)){return x;}
        }
        else {
            _x = x;
        }
        if ((_x) >= 0) 
            return "+ "+ _x;
        else return "- " + (-1*_x);
    };



    /** 
     * @constructor
     */
    function NumberPad() {
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
            that.clear();
            return null;
        }

        /**
         * handle any dragging of the number pad
         * @callback
         */ 
        function dragHandler(event) {
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
                    cx = event.clientX;
                    cy = event.clientY;
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
                switch (event.type) {
                    case "touchmove": 
                        x = event.touches[0].clientX-cx + x0;
                        y = event.touches[0].clientY-cy + y0;
                        break;
                    default: 
                        x = event.clientX-cx + x0;
                        y = event.clientY-cy + y0;
                }
                that.$numpad.css({
                    "left": x,
                    "top": y 
                }); 
            }
        }


        // I don't like unbinding previous handlers like this, but it works for now.
        this.$numpad.off();
        this.$numpad[0].addEventListener("mousedown", dragHandler);
        this.$numpad[0].addEventListener("touchstart", dragHandler);
        this.$numpad[0].addEventListener("click", clickHandler);
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
        this.$numpad.removeClass("offscreen");
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
var numpad = {};

// diamond.js is a file associated with the factor-trinomial 
// browser application. It role is to set up a diamond, which
// aids in the factoring of a trinomial. 
//
// copyright (c) 2013 By Alexander Ressler
//
// ================================================================================================
// 
// DOM elements with id = ft-diamond-text-<number> 
//     these are the DOM ids that correspond to each LaTeX expression within the diamond
// expression
//     used to set up the DOM span elements inside diamond, which will hold the rendered LaTeX
// inputBox
//     used for the DOM input element when you click on part of the diamond
// coefficients
//     object containing the values a,b,c in polynomial ax^2 + bx + c
//
// ================================================================================================




    /** IIFE returns diamond object ready for use */
    Diamond = (function() {
        var parameters = [1, -17, 30]; // these are the a,b,c that go in ax^2 + bx + c -- set by initialize
        var diamondNumber = 0;
        var diamondInputs = [];
        var View_MAX = 350;   // set the max pixels for the diamond's box container

        // jQuery selectors
        var diamondBox1 = "[data-diamond='1']";
        var diamondBox2 = "[data-diamond='2']";
        var diamondBox3 = "[data-diamond='3']";
        var diamondBox4 = "[data-diamond='4']";


        var diamondBoxes = [diamondBox1, diamondBox2, diamondBox3, diamondBox4];

        // for presentational purposes only
        function cleanParameters() {
            var c;
            var coefficients =
               {
                a:parameters[0],
                b:parameters[1],
                c:parameters[2]
               };


            for (c in coefficients) {
                switch (c) {
                    case "a":
                        coefficients[c] = ifOneOrNegOne(coefficients[c], false);
                        if (typeof coefficients[c] == "string") {
                            coefficients[c] = coefficients[c].replace('+', '');
                        }
                        break;
                    case "b":
                        coefficients[c] = ifOneOrNegOne(coefficients[c], false);
                        coefficients[c] = prettifySign(coefficients[c]);
                        break;
                    case "c":
                        coefficients[c] = ifOneOrNegOne(coefficients[c], true);
                        coefficients[c] = prettifySign(coefficients[c]);
                        break;
                    default:
                        throw new Error("unexpected coefficents prameter");
                }
            }
            return coefficients;
        }

        
        // This is the function that will create the user input the diamond is clicked.
        // * should only be responsible for creating the input box and printing the MathJax
        // DEPRECATED!!!
        /** @deprecated */
        function createInputBox(event) {
            $(Diamond.inputBox).remove();
            var svgTarget = event.currentTarget;
            diamondNumber = svgTarget.className.baseVal.replace("ft-diamondBox-", "");
            var coords = [event.clientX, event.clientY];

            $("#ft-diamond-text-"+diamondNumber).remove();

            Diamond.inputBox = document.createElement("input");
            Diamond.expression = document.createElement("span");

            Diamond.inputBox.setAttribute("style",
                                "position:absolute;" +
                                "top:"+coords[1] +"px;"+
                                "left:"+coords[0]+"px;"+
                                "height:50px;" +
                                "width:100px;"+
                                "font-size:22px;"
            );
            Diamond.inputBox.setAttribute("class", "ft-d-input-box");
            $("body").append(Diamond.inputBox);
            Diamond.inputBox.focus();
            // binding a keyup event to the input box
            // use the event to figure out what diamond you clicked and run through a switch
            // CONTINUE ON ENTER (KEY VAL 13)
             $(".ft-d-input-box").keydown(function(event) {
                if(event.which === 13) {
                    setInputBox(event);  
                }
            });
             $(".ft-d-input-box").blur(function(event) {
                 setInputBox(event);  
            });
        }
        
        // instead of relying on MathJax to resolve x^2... just do a regex to match
        // that style of expression and use native html x<sup> whatever </sup>
        function renderMath(diamondText) {
            var output = '';
            if (diamondText && diamondText.match) {
                if (diamondText.match(/\^/)) {
                    var pre = diamondText.match(/(.*)\^/)[1];
                    var exponent = diamondText.match(/\^(.*)/)[1];
                    output = pre + "<sup>" + exponent + "</sup>";
                    output = output.replace("x", "<i>x</i>");
                    return output;
                }
                else {
                    output = diamondText;
                    output = output.replace("x", "<i>x</i>");
                    return output;
                }
            }
            else {
                console.log("TODO");
                console.log("The text is supposed to have a regex match method.");
            }
        }

        /** @deprecated */
        function setInputBox(event) {
            var text = $(Diamond.inputBox).val();
            // Get rid of all the spaces in the user's input text
            if (text.indexOf(" ") !== -1) {
                while (text.indexOf(" ") !== -1) {
                    text = text.replace(" ", "");
                }
            }
            // textCoords is where the text will go
            var textCoords=[null,null];

            var svg_container_offset = $(".ft-svg-container").offset();
            
            var localLeft = svg_container_offset.left;
            var localTop = svg_container_offset.top;
            // instead of relying on MathJax to resolve x^2... just do a regex to match
            // that style of expression and use native html x<sup> whatever </sup>
            function renderMath(diamondText) {
                var output = '';
                if (diamondText && diamondText.match) {
                    if (diamondText.match(/\^/)) {
                        var pre = diamondText.match(/(.*)\^/)[1];
                        var exponent = diamondText.match(/\^(.*)/)[1];
                        output = pre + "<sup>" + exponent + "</sup>";
                        output = output.replace("x", "<i>x</i>");
                        return output;
                    }
                    else {
                        output = diamondText;
                        output = output.replace("x", "<i>x</i>");
                        return output;
                    }
                }
                else {
                    console.log("TODO");
                    console.log("The text is supposed to have a regex match method.");
                }
            }

            switch (parseInt(diamondNumber)) {
                    // Don't ask about these ratios... they're for positioning         
                case 1:
                    textCoords = [17.0/35.0*View_MAX, 25.0/35.0*View_MAX];
                    break;
                case 2:
                    textCoords = [8.0/35.0*View_MAX, 17.0/35.0*View_MAX];
                    break;
                case 3:
                    textCoords = [17.0/35.0*View_MAX, 71.0/350.0*View_MAX];
                    break;
                case 4:
                    textCoords = [26.0/35.0*View_MAX, 17.0/35.0*View_MAX];
                    break;
                default:
                    throw "something's wrong with the diamond number.";
            }
            Diamond.expression.setAttribute("id", "ft-diamond-text-"+diamondNumber);
            Diamond.expression.setAttribute("style",
                                       "position:absolute;"+ 
                                       "top:"+(textCoords[1])+"px;"+
                                       "left:"+(textCoords[0])+"px;"
            );
            // now write the LaTeX string to the expression and append to body
            $(Diamond.expression).html(renderMath(text));

            $(".ft-diamond").append(Diamond.expression);
            $(Diamond.inputBox).remove();
            // store what the user just entered in diamondInputs array
            // store text in a 1-1 fashion matching the diamondNumber
            diamondInputs[parseInt(diamondNumber)-1] = text;
            
            // ============
            // Check Values
            // ============
            
            diamondInputs = formatDiamondInput(diamondInputs);
            checkDiamondInputs(diamondInputs);
        }
        

        // array in ... array out
        function formatDiamondInput(data) {
            for (var i=0; i<4; i++) {
                if (typeof data[i] === "undefined") {
                    continue;
                }
                data[i] = data[i].replace(/(.*)<span.class="exp">2<\/span>/, "$1^2");
                // Handle the case if the coefficient is an implied 1 or an implied -1.
                if (isNaN(parseInt(data[i]))) {
                    switch (data[i][0]) {
                        case "x": //implied 1
                            data[i] = "1"+data[i];
                            break;
                        case "-": //implied -1
                            data[i] = data[i].replace("-","-1");
                            break;
                        default:
                            appMessenger.send("ft-guide", "There's something wrong with what you entered. " + "I was expecting the expression to start with x or -x");
                    }
                }
            }
            return data;
        }

        // This for loop is where I check the diamondInputs against the parameters.
        // I'm going to color the diamond parts here.
        function checkDiamondInputs(dFormatted) {
            for (var i=0; i<4; i++) {
                if (!dFormatted[i] || !dFormatted[i].match('x')) {
                    appMessenger.send("ft-guide", "Make sure you are using the correct variable.");
                }
                switch (i) {
                    // bottom square --- match middle term
                    case 0:
                        if (dFormatted[0] === undefined){break;}
                        if (dFormatted[0] !== (parameters[1]+'x')) {
                            appMessenger.send("ft-guide", "That is not the correct value for the sum.");
                            appMessenger.send("ft-d-eval", {0:false});
                        }
                        else {
                            appMessenger.send("ft-d-eval", {0:true});
                        }
                        break;
                    case 1:
                        if (dFormatted[1] === undefined || dFormatted[3] === undefined){break;}
                        if ((parseInt(dFormatted[1])+parseInt(dFormatted[3])+'x') !== (parameters[1]+'x')) {
                            appMessenger.send("ft-guide", "The left and right diamond inputs don't add up to the correct value.");
                            appMessenger.send("ft-d-eval", {1:false, 3:false});
                        }
                        else {
                            appMessenger.send("ft-d-eval", {1:true, 3:true});
                            appMessenger.send("ft-guide", "It looks like the sum is correct!");
                        }
                        break;
                    // top square --- if product isn't correct
                    case 2:
                        if (dFormatted[2] === undefined){break;}
                        if (dFormatted[2] !== ((parameters[0]*parameters[2])+"x^2")) {
                            appMessenger.send("ft-d-eval", {2:false});
                        }
                        else {
                            appMessenger.send("ft-guide", ("the product was correct: "+dFormatted[i]));
                            appMessenger.send("ft-d-eval", {2:true});
                        }
                        break;
                    // right square --- if sum doesn't add up
                    case 3:
                        if (dFormatted[1] === undefined || dFormatted[3] === undefined){break;}
                        if ((parseInt(dFormatted[1])+parseInt(dFormatted[3])+'x') != (parameters[1]+'x')) {
                            appMessenger.send("ft-guide", "The left and right diamond inputs don't add up to the correct value.");
                            appMessenger.send("ft-d-eval", {1:false, 3:false});
                        }
                        else {
                            appMessenger.send("ft-d-eval", {1:true, 3:true});
                        }
                        break;
                    default:
                        console.log("Something is seriously wrong... contact tech support");
                        throw "Error while parsing index in checkDiamondInputs";
                }
            }
        }

        function insertDiamondText(classSelector, text) {
            $(classSelector + " > span").html(text);
        }

        return {

            initialize: function(_p1, _p2, _p3) {
                var selectedDiamond = null;
                var coefficients;

                if (typeof(_p1) === "number" && typeof(_p2) === "number" && typeof(_p3) === "number") {
                    parameters = [_p1, _p2, _p3];
                    appMessenger.send("setParameters", _p1, _p2, _p3);
                }           
                appMessenger.send("setParameters", parameters[0], parameters[1], parameters[2]);
               
                diamondInputs=[]; 
                this.clearDiamondInput(); 

                coefficients = cleanParameters();

                //$(".ft-trinomial").html("Factor the following trinomial: &nbsp;" + "<span class='ft-trinomial-equation' style='font-size:22px'>" + coefficients.a+"<em>x</em><sup>2</sup> " + coefficients.b+"<em>x</em> " + coefficients.c + "</span>"); 

                $trinomialHeader = $(".ft-trinomial");
                $trinomialHeader.find(".ft-trinomial-equation .a").html(coefficients.a);
                $trinomialHeader.find(".ft-trinomial-equation .b").html(coefficients.b);
                $trinomialHeader.find(".ft-trinomial-equation .c").html(coefficients.c);
                
                numpad = new NumberPad();
                numpad.hide();

                function diamondClickHandler(event) {
                    selectedDiamond = $(this).data("diamond");
                    $(diamondBoxes.join()).removeClass("selected");
                    $(event.currentTarget).addClass("selected");
                    numpad.clear();
                    numpad.show();
                }

                $(diamondBoxes.join()).on("click", diamondClickHandler);
                appMessenger.on("diamondCorrect", function() {
                    $(diamondBoxes.join()).off("click", diamondClickHandler);
                });

                numpad.onclick = function(str, buff) {
                    $(".diamond-part.selected span").html(renderMath(str));
                    diamondInputs[selectedDiamond-1] = str;
                };

                numpad.onenter = function(str, buff) {
                    $(".diamond-part.selected span").html(renderMath(str));
                    $(diamondBoxes.join()).removeClass("selected");
                    diamondInputs[selectedDiamond-1] = str;
                    // ============
                    // Check Values
                    // ============
                    diamondInputs = formatDiamondInput(diamondInputs);
                    checkDiamondInputs(diamondInputs);
                };

                return null;
            },

            /**
             * Recursive function to clear diamond inputs and call diamond eval
             */
            clearDiamondInput: function(n) {
                n = (typeof n === "undefined" || n > 4) ? 4 : n; //start at n=4
                // weird... passing this message object doesn't really do 
                // anything. I guess it's just a placeholder that forces 
                // an evaluation
                appMessenger.send("ft-d-eval", {message:"clear "+n});
                $(diamondBoxes[n])
                    .removeClass("selected")
                    .removeClass("correct")
                    .removeClass("incorrect");
                $(diamondBoxes[n] + " span").html("");
                if (n >= 0) { 
                    this.clearDiamondInput(--n); // recursive call.
                }
            },
            
            /**
             * Add a class to a diamond box depending that corresponds to the valid argument.
             * @param {Boolean} valid - true will add the 'correct' class, 'incorrect' otherwise.
             * @param {Number} n - Diamond number (1-4).
             */
            colorDiamondInput: function(n, valid) {
                if (typeof(n) === "undefined") {
                    throw new Error("Expecting 'n' a specific diamond.");
                }
                if (typeof(valid) === "undefined") {
                    throw new Error("Expecting a 'valid' boolean argument");
                }
                if (n > 0 && n < 5) {
                    if (valid) {
                        $(diamondBoxes[n-1])
                            .removeClass("incorrect")
                            .addClass("correct");
                    }
                    else {
                        $(diamondBoxes[n-1])
                            .removeClass("correct")
                            .addClass("incorrect");
                    }
                    return null;
                }
                else {
                    throw new Error("colorDiamondInput out of range. Expecting range 1-4.");
                }

            }
        };
    }());
// rectangle.js is a file associated with the factor-trinomial 
// browser application. It role is to set up a diamond, which
// aids in the factoring of a trinomial. 
//
// copyright (c) 2013 By Alexander Ressler
//
// ================================================================================================




    var Rectangle = function() {
        // add <input> to rectangle divs
        var container = document.getElementsByClassName("ft-rectangle")[0];
        
        
        appMessenger.on("setMainDiagonal", function(){
            var parameters = appMessenger.send("getParameters");
            var polynomial = clean_parameters(parameters);
            
            $(".fta").html("<span>"+polynomial.a+"<i>x</i><sup>2</sup></span>");
            $(".ftd").html("<span>"+parameters[2]+"</span>");
        });
        //copied from diamond.js... maybe you should make a helpers file 
        function clean_parameters(parameters) {  // for presentational purposes only
            var coefficients =
               {
                a:parameters[0],
                b:parameters[1],
                c:parameters[2]
               };

            for (var c in coefficients) {
                switch (c) {
                    case "a":
                        coefficients[c] = ifOneOrNegOne(coefficients[c], false);
                        if (typeof coefficients[c] == "string") {
                            coefficients[c] = coefficients[c].replace('+', '');
                        }
                        break;
                    case "b":
                        coefficients[c] = ifOneOrNegOne(coefficients[c], false);
                        coefficients[c] = prettifySign(coefficients[c]);
                        break;
                    case "c":
                        coefficients[c] = ifOneOrNegOne(coefficients[c], true);
                        coefficients[c] = prettifySign(coefficients[c]);
                        break;
                    default:
                        throw new Error("unexpected coefficents prameter");
                }
            }
            return coefficients;
        }
    };
var randomInt = function randomInt(min,max, withZero) {
        var rand = Math.random();
        var randInt = Math.round(min + rand*(max-min));
        if (withZero) {
            return randInt;
        }
        else {
            while (randInt === 0) {
                rand = Math.random();
                randInt = Math.round(min + rand*(max-min));
            }
            return randInt;
        }
    };

// fg-messenger-central.js coordinates the Messenger with any handles that need to run when 
// custom events are sent. 
//
// copyright (c) 2013 By Alexander Ressler
//
// =========================================================================================




    function FTMessengerCentral() {

        
        var $currentRectangle = null;
        // diamond get's reset by initialize
        var diamond = {
            0:null,
            1:null,
            2:null,
            3:null
        };
        var polynomial = [1,2,1];
        var rectangleElements = [null, null, null, null];
        var diamondElements = ["1", "2", "3", "4"];

        this.on     = function() {appMessenger.on.apply(this, arguments);};
        this.off    = function() {appMessenger.off.apply(this, arguments);};
        this.send   = function() {appMessenger.send.apply(this, arguments);};
        function evaluateDiamond(dInput) {
            $.extend(diamond, dInput);
            
            // Check the middle terms (1) and (3)
            if (diamond['1'] && diamond['3']) {
                Diamond.colorDiamondInput(2, true);
                Diamond.colorDiamondInput(4, true);
            }
            else {
                if (diamond['1'] !== null && diamond['3'] !== null) {
                    Diamond.colorDiamondInput(2, false);
                    Diamond.colorDiamondInput(4, false);
                }
            }

            // Check the SUM term... the bottom one
            if (diamond['0'] !== null) {
                if (diamond['0']) {
                    Diamond.colorDiamondInput(1, true);
                }
                else {
                    Diamond.colorDiamondInput(1, false);    
                }
            }
            
            // Check the PRODUCT term... the top one
            if (diamond['2'] !== null) {
                if (diamond['2']) {
                    Diamond.colorDiamondInput(3, true);
                }
                else {
                    Diamond.colorDiamondInput(3, false); 
                }
            }
            
            // Check all the terms
            if (diamond['0'] && diamond['1'] && diamond['2'] && diamond['3']) {
                console.log("diamond ready");
                appMessenger.off("createInputBox", createInputBox);
                appMessenger.send("diamondCorrect");
            }
        }
        
        function diamondCorrect() {
            console.log("calling diamondCorrect");
            $(".ftH span").removeClass("hide");  
            $(".ftb span").html($("[data-diamond='2']").html());
            $(".ftc span").html($("[data-diamond='4']").html());
            // show inner rectangle
            $(".fta span").removeClass("hide");
            $(".ftd span").removeClass("hide");
            $(".ftb span").removeClass("hide");
            $(".ftc span").removeClass("hide");
            
            diamondElements = formatInput( getDiamondElements() );
            console.log(diamondElements);

            bindRectangleEvents();
        }

        /**
         * event handler for rectangle clicks.
         * @callback 
         */
        function rectangleInputHandler(event) {
            $currentRectangle = $(this);
            $currentRectangle.addClass("selected");
            var parsedValue = $currentRectangle.html().replace(/\+/g,"").replace(/ /g,"");
            $currentRectangle.html(parsedValue);
            setRectangleElement(parsedValue, $currentRectangle.attr("class"));
            checkRectangleElements();
            numpad.show();
        }

        function bindRectangleEvents() {
            if (numpad.destroy) {
                numpad.destroy();
            }
            numpad = new NumberPad();

            // insert numpad output in selected rectangle box
            numpad.onenter = function(str, buff) {
                numpad.hide();
                $currentRectangle.html(str);
                rectangleInputHandler.call($currentRectangle);
                $currentRectangle.removeClass("selected");
            };
            numpad.onclick = function(str, buff) {
                $currentRectangle.html(str);
            };


            //$(".ftx1,.ftk1,.ftx2,.ftk2").bind("click", createRectangleInput);
            $(".ftx1,.ftk1,.ftx2,.ftk2").on("click", rectangleInputHandler);
            appMessenger.on("genericRectangleComplete", function() {
                $(".ftx1,.ftk1,.ftx2,.ftk2").off("click", rectangleInputHandler);
                numpad.hide();
                numpad.destroy();
            });
        }

        function createRectangleInput(e) {
            var target = e.currentTarget;
            var input = document.createElement("input");
            $(target).html(input);
            $(input).focus();
            $(input).bind("keyup", function(e){
                if (e.which === 13) {
                    setRectangleInput.call(this,target);
                }
            });
            $(input).bind("blur", function(e){
                setRectangleInput.call(this,target);
            });
        }

        function setRectangleInput(target) {
            var parsedValue = this.value.replace(/\+/g,"").replace(/ /g,"");
            $(target).html(renderMath(parsedValue));
            setRectangleElement(parsedValue, $(target).attr("class"));
            checkRectangleElements();
        }
         
        // START CHECKING THE RECTANGLE
        function checkRectangleElements() {
            var formattedRectEls = formatInput(rectangleElements);
            var formattedX1 = parseInt(formattedRectEls[0]);
            var formattedX2 = formattedRectEls[2];
            var topRowGCF = getTopRowGCF();
            var parameters = appMessenger.send("getParameters");
            var aIsNegative = (parameters[0] < 0) ? true : false;
            var diamondElements = appMessenger.send("getDiamondElements");
            var correctness = [false, false, false, false]; // x1, k1, x2, k2
            
            // check the GCF slot in $(".ftx1")
            if (formattedX1 === topRowGCF) {
                if (rectangleElements[0] === (topRowGCF+"x")) {
                    correctness[0] = true;
                    colorRectangleInput(".ftx1", true);
                }
                else {
                    colorRectangleInput(".ftx1", false);
                }
            }
            else if (!isNaN(formattedX1)) {
                colorRectangleInput(".ftx1", false);
            }
            // check the x2 slot
            if (!Number.isNaN(parseInt(formattedX2)) && !Number.isNaN(formattedX1)) { // is it empty?
                if (parseInt(formattedX2)*parseInt(formattedX1) == parameters[0]) { // does x1*x2 = ax^2?
                    if (formattedX2.replace(parseInt(formattedX2), "").replace(/x/,"") === "" && formattedX2.match(/x/)) { // is there only numbers and an x?
                        correctness[2] = true;
                        colorRectangleInput(".ftx2", true);
                    }
                    else {
                        colorRectangleInput(".ftx2", false);
                        correctness[2] = false;
                    }
                } 
                else {
                    colorRectangleInput(".ftx2", false);
                }
            }

            // check the k1 slot... it needs to have numbers only. k1*x2 = c, that is, cell c from the grid layout
            if (!Number.isNaN(parseInt(formattedX2)) && formattedRectEls[1] !== null) {
                if (formattedRectEls[1].replace(parseInt(formattedRectEls[1]), "") === "" && correctness[2]) { // is there only numbers?
                    // and is the x2 slot correct?
                    if ((parseInt(formattedRectEls[1])*parseInt(formattedX2)+"x") == (diamondElements[3])){
                        correctness[1] = true;
                        colorRectangleInput(".ftk1", true);
                    }
                    else {
                        colorRectangleInput(".ftk1", false);
                    }
                }
                else {
                    colorRectangleInput(".ftk1", false);
                }
            }
            
            // Lastly, like checking for k1, but check for k2
            if (!Number.isNaN(parseInt(formattedX2)) && formattedRectEls[3] !== null) {
                if (formattedRectEls[3].replace(parseInt(formattedRectEls[3]), "") === "" && correctness[0]) { // is there only numbers?
                    // and is the x2 slot correct?
                    if ((parseInt(formattedRectEls[3])*parseInt(formattedX1)+"x") == (diamondElements[1])){
                        correctness[3] = true;
                        colorRectangleInput(".ftk2", true);
                    }
                    else {
                        colorRectangleInput(".ftk2", false);
                    }
                }
                else {
                    colorRectangleInput(".ftk2", false);
                }
            }
            
            //  all correct?
            if (correctness[0] && correctness[1] && correctness[2] && correctness[3]) {
            //YES!!!
                appMessenger.send("genericRectangleComplete");
            }
        }

        function genericRectangleComplete() {
            console.log("YAYAA!!!");
            var rectEls = appMessenger.send("getRectangleElements");
            rectEls[0] = checkSimpleCases(rectEls[0]);
            rectEls[2] = checkSimpleCases(rectEls[2]);
           
            if (parseInt(rectEls[1]) >= 0){rectEls[1] = "+"+rectEls[1];}
            if (parseInt(rectEls[3]) >= 0){rectEls[3] = "+"+rectEls[3];}
            
            
            $(".ft-finalContainer").show();
            $(".ft-finalContainer .explanationArea").html("Great! The factors are exactly: " + "<br>" + "(" + rectEls[0] + rectEls[1] + ") (" + rectEls[2] + rectEls[3] + ") = " + $(".ft-trinomial span").html() + "<br>");

            setTimeout(function(){
                $(".ft-finalContainer button").attr("disabled", false);
            },1000);
            
            function checkSimpleCases(str) {
                if (str == "1x"){return "x";}
                if (str == "-1x"){return "-x";}
                return str;
            }
            
        }
        
        function colorRectangleInput($selector, bool) {
            if (bool) {
                $($selector)
                    .addClass("correct")
                    .removeClass("incorrect");
            }
            else {
                $($selector)
                    .addClass("incorrect")
                    .removeClass("correct");
            }
        }

        function clearRectangleInputs() {
            $(".ftx1, .ftx2, .ftk1, .ftk2")//.css({"background":"None"});
                .removeClass("correct")
                .removeClass("incorrect");
                    
            $(".ftx1, .ftx2, .ftk1, .ftk2").html("");
        }

        function getTopRowGCF() {
            var a11 = Math.abs( appMessenger.send("getParameters")[0] ); // this is a number 
            var a12 = diamondElements[1]; // this is a string... need to parseInt
            var a12Parsed = Math.abs( parseInt(a12) );

             
            if (a11 == 1 || a12Parsed == 1) { 
                return 1;
            }
            else {
                var a11p = Math.primeFactors(Math.abs(a11));
                var a12p = Math.primeFactors(a12Parsed);
                return getGCF(a11p, a12p); 
            }
        }

        function getGCF(a1,a2) {
            // computes the GCF of 2 numbers that have been processed by Math.primeFactors
            var bases1          = [];
            var bases2          = [];
            var a1Len           = a1.length;
            var a2Len           = a2.length;
            var a1lenLessThanA2 = (a1Len<a2Len) ? true : false;

            function findMatchingElements(array1, array2) {
                var matches = [];
                for (var i=0; i<a1Len; i++) {
                    for (var j=0; j<a2Len; j++) {
                        if (array1[i] == array2[j]) {
                            matches[i] = array1[i];  
                        }
                    }
                }
                return matches;
            }
            
            function findBaseExp(array,base) {
                var arrayLen = array.length;
                for (var i=0; i<arrayLen; i++) {
                    if (array[i][0] == base) {
                        return array[i][1];
                    }
                    else {
                        continue;
                    }
                }
            }
        
            //==========================================================
            for (i=0; i<a1Len; i++) {
                bases1[i] = a1[i][0];
            }
            for (i=0; i<a2Len; i++) {
                bases2[i] = a2[i][0];
            }

            // here's the array of bases that are common to a1 and a2
            var matchingBases       = findMatchingElements(bases1,bases2);
            var matchingBasesLen    = matchingBases.length;
            var matchedBase         = 1;
            var minExp              = 1;
            var GCF                 = 1;
            var testGCF             = 1;
            var i=0, j=0;
            
            // time to go through the matches, and compare the associated exponents 
            // we're taking the shortest route... if a1Len < a2Len then ..., else ... 
            for (i=0; i<matchingBasesLen; i++) {
                if (a1lenLessThanA2) {
                    for (j=0; j<a1Len; j++) {
                        if (a1[j][0] == matchingBases[i]) {
                            // we have a match...
                            matchedBase = a1[j][0];
                            // now compare the exponnents: min(a1[j][1], findBaseExp(a2,a1[j][0]))
                            minExp = Math.min(a1[j][1], findBaseExp(a2, matchedBase));
                            testGCF = Math.pow(matchedBase, minExp);

                            if (testGCF > GCF) {
                                GCF = testGCF;
                            }
                            else {
                                continue;
                            }
                        }
                    }
                }
                else {
                    for (j=0; j<a2Len; j++) {
                        if (a2[j][0] == matchingBases[i]) {
                            // we have a match...
                            matchedBase = a2[j][0];
                            // now compare the exponnents: min(a1[j][1], findBaseExp(a2,a1[j][0]))
                            minExp = Math.min(a2[j][1], findBaseExp(a1, matchedBase));
                            testGCF = Math.pow(matchedBase, minExp);
                            if (testGCF > GCF) {
                                GCF = testGCF;
                            }
                            else {
                                continue;
                            }
                        }
                    }
                }
            }
            return GCF;
        }

        // array in ... array out
        function formatInput(data) {
            for (var i=0; i<4; i++) {
                if (typeof data[i] === "undefined" || data[i] === null) {
                    continue;
                }
                else {
                    data[i] = data[i].replace("<sup>2</sup>","");
                    data[i] = data[i].replace(/</g,"");    
                    data[i] = data[i].replace(/>/g,"");    
                    data[i] = data[i].replace("/","");    
                    data[i] = data[i].replace(/i/g,"");    
                    data[i] = data[i].replace(/\+/g, "");
                }
                // Handle the case if the coefficient is an implied 1 or an implied -1.
                if (isNaN(parseInt(data[i]))) {
                    switch (data[i][0]) {
                        case "x": //implied 1
                            data[i] = "1"+data[i];
                            break;
                        case "-": //implied -1
                            data[i] = data[i].replace("-","-1");
                            break;
                        default:
                            appMessenger.send("ft-guide", "There's something wrong with what you entered. " + "I was expecting the expression to start with x or -x");
                    }
                }
            }
            return data;
        }

        function setRectangleElement(str, className) {
            if (className.match(/ftx1/)) {
                    rectangleElements[0] = str;
                    return null;
            }
            else if (className.match(/ftk1/)) {
                    rectangleElements[1] = str;
                    return null;
            }
            else if (className.match(/ftx2/)) {
                    rectangleElements[2] = str;
                    return null;
            }
            else if (className.match(/ftk2/)) {
                    rectangleElements[3] = str;
                    return null;
            }
            else {
                throw new Error("there's no matching class name when setting rectangle inputs");
            }
        }

        function getParameters() {
            return polynomial;
        }

        function setParameters(a,b,c) {
            if (arguments.length != 3) {throw new Error("Error -- bad parameters?!!!");}
            else {
                polynomial = arguments;
            } 
            return polynomial; 
        }

        function createInputBox(arg0,arg1) {
            arg1(arg0);// Wow this isn't human-readable, but it's something in diamond.js.
        }

        function renderMath(diamondText) {
            var output = '';
            if (diamondText && diamondText.match) {
                if (diamondText.match(/\^/)) {
                    var pre = diamondText.match(/(.*)\^/)[1];
                    var exponent = diamondText.match(/\^(.*)/)[1];
                    output = pre + "<sup>" + exponent + "</sup>";
                    output = output.replace("x", "<i>x</i>");
                    return output;
                }
                else {
                    output = diamondText;
                    output = output.replace("x", "<i>x</i>");
                    return output;
                }
            }
            else {
                //throw new Error("The text is supposed to have a regex match method.");
            }
        }

        function getDiamondElements() {
            for (var i=0; i<4; i++) {
                diamondElements[i] = $("[data-diamond="+(i+1)+"] span").html();
            }
            return diamondElements;
        }

        function guide(msg) {
            console.log("you are logging to ft-guide: "+msg);
        }
        
        // ===========================================================================================
        appMessenger.on("randomize", function() {
            diamond = {
                    0:null,
                    1:null,
                    2:null,
                    3:null
            };
            // (ax + b)(cx + d) = (ac)x^2 + (ad + bc)x + bd
            var a = randomInt(1,1, false);
            var b = randomInt(-10,10, false);
            var c = randomInt(1,2, false); 
            var d = randomInt(-10,10, false);
            appMessenger.send("initialize", (a*c), (a*d+b*c), (b*d));
        });
        
        // give this a,b,c
        appMessenger.on("initialize", function(a,b,c) {
            rectangleElements = [null,null,null,null];
            diamondElements = ["1", "2", "3", "4"];
            diamond = {
                    0:null,
                    1:null,
                    2:null,
                    3:null
            };
            if (!a || !b || !c) {
                Diamond.initialize();
            }
            else {
                Diamond.initialize(a,b,c);
            }
            
            appMessenger.on("createInputBox", createInputBox);
            appMessenger.send("setMainDiagonal");
            appMessenger.send("onLoad");
            appMessenger.send("clearRectangle");
        });

        appMessenger.on("ft-guide", guide);
        appMessenger.on("ft-d-eval", evaluateDiamond);
        appMessenger.on("getParameters", getParameters);
        appMessenger.on("setParameters", setParameters);
        appMessenger.on("diamondCorrect", diamondCorrect);
        appMessenger.on("getDiamondElements", function(){return diamondElements;});
        appMessenger.on("getRectangleElements", function(){return rectangleElements;});
        appMessenger.on("clearRectangle", clearRectangleInputs);
        appMessenger.on("genericRectangleComplete", genericRectangleComplete);
        appMessenger.on("onLoad", function() {
            $(function() {
                $(".ftH span").addClass("hide");  
                $(".fta span").addClass("hide");
                $(".ftd span").addClass("hide");
                $(".ftb span").addClass("hide");
                $(".ftc span").addClass("hide");
                $(".ft-finalContainer button").attr("disabled", true);
                $(".ft-finalContainer").hide();
                $(".ftx1,.ftk1,.ftx2,.ftk2").unbind("click", createRectangleInput);
                window.setTimeout(function() {
                    $(".ftH span, .fta span, .ftb span, .ftc span, .ftd span").css({
                        "-webkit-transition"    : "all 1s;",
                        "-moz-transition"       : "all 1s",
                        "transition"            : "all 1s"
                    });
                }, 1);
            });
        });

    }














var templates = {
numberPad:'<div class="numpad no-select-no-drag transition-top">    <div class="number pushable-down">0</div>    <div class="number pushable-down">1</div>    <div class="number pushable-down">2</div>    <div class="number pushable-down">3</div>    <div class="number pushable-down">4</div>    <div class="number pushable-down">5</div>    <div class="number pushable-down">6</div>    <div class="number pushable-down">7</div>    <div class="number pushable-down">8</div>    <div class="number pushable-down">9</div>    <div class="number pushable-down">x</div>    <div class="number pushable-down">x<span class="exp">2</span></div>    <div class="number pushable-down">-</div>    <div class="number operator pushable-down">Enter</div></div>  ',
 navButtons:'<div class="nav-buttons no-select-no-drag">    <div class="btn pushable">        <span>Back</span>    </div>    <div class="btn pushable">        <span>Next</span>    </div></div>',
 header:'<header>    <h1 id="header-title">Factor Trinomials</h1>    <h4>This is a helpful resource for anyone studying math.        Practice factoring trinomials here.<br/> If you are        new to the site, head over to the tutorial page        to get step by step directions.    </h4>        <ul id="nav">        <li><a href="#">Home</a></li>        <li><a href="#">About</a></li>        <li><a href="html/example-ft.html">Tutorial</a></li>    </ul></header>',
 finalContainer:'<div class="clear"></div> <!-- TODO: remove that clear div to the left --><div class="ft-finalContainer">    <div class="explanationArea"></div>    <div class="clear"></div>    <button id="next-button" >TRY ANOTHER!!!</button></div>',
 rectangle:'<div class="ft-rectangle">    <!--                LAYOUT           -----------------           |               |           |   H  x2 | k2  |           |     --------- |           |  x1 | a | b | |           |  ------------ |           |  k1 | c | d | |           |     --------- |           -----------------        (H := hint)    -->    <div class="ftH"><span>The GCF of the top<br/>row goes here<br/>&#x25BC;</span></div>     <div class="ftx2"></div>     <div class="ftk2"></div>     <div class="ftx1"></div>     <div class="fta"></div>     <div class="ftb"><span></span></div>     <div class="ftk1"></div>      <div class="ftc"><span></span></div>     <div class="ftd"></div>   </div>   ',
 diamond:'<div class="ft-diamond">    <span class="diamond-part" data-diamond="1"><span></span></span>    <span class="diamond-part" data-diamond="2"><span></span></span>    <span class="diamond-part" data-diamond="3"><span></span></span>    <span class="diamond-part" data-diamond="4"><span></span></span></div>',
 trinomial :'<div class="ft-trinomial"><span>    <span>        Factor the following trinomial: &nbsp;    </span>    <span class="ft-trinomial-equation">         <span class="a"></span>x<span class="exp">2</span>         <span class="b"></span>x        <span class="c"></span>     </span></span></div>'
};
// Find the prime factorization of a number n
// this algorithm returns an array of arrays,
// where the inner arrays [x,y] represent x^y
// combinations. 
// 
// Example:
// 
//  input  -> Math.primeFactors(18);
//  output -> [[2,1],[3,2]] == 2^1*3^2 == 18

var primeFactors = function primeFactors(n) {
        if (n%1 !== 0 || n<2){throw new Error("primeFactors expected a natural number other than 1. throw: "+n);}

        var _primeFactors    = [];
        var upperBound      = Math.floor(n/2)+1;
        var testFactor      = 1;

        for (var i=2; i<upperBound; i++) {
            testFactor = multiplicity(i,n);
            // check if i is prime
            if (!isPrime(i)) continue;
            if (testFactor !== 0) {
                _primeFactors.push([i,testFactor]);
                if (isCompleteFactorization(_primeFactors, n)) {
                    return _primeFactors;
                }
            }
        }

        // didn't return primeFactors? then n is a prime.
        return [ [n,1] ];



        // ================================================================================
        // Section: Footer ... helper functions
        // ================================================================================


        /** 
         *
         * find the k such that a^k | b 
         * @returns k (the multiplicity of a into b);
         */ 
        function multiplicity(a, b) {
            var a_new = a;
            var k = 0;
            if (b%a !== 0) {
                return 0;
            }
            else {
                do {
                    a_new *= a;
                    k++;
                } while ((b % a_new === 0));
                if (a_new === b) {
                    k++;
                }
                return k;
            }
        }
        
        /**
         * is the 2d array primesWithMult is the prime factorization of number
         */
        function isCompleteFactorization(primesWithMult, number) {
            var len = primesWithMult.length;
            var product = 1;
            for (var i=0; i<len; i++) {
                product *= Math.pow(primesWithMult[i][0], primesWithMult[i][1]);
            }
            if (product === number) {
                return true;
            }
            else {
                return false;
            }
        }
        
        function isPrime(k) {
            if (Number.isNaN(k) || !isFinite(k) || k%1 || k<2) return false; 
            if (k%2===0) return (k===2);
            if (k%3===0) return (k===3);
            var m=Math.sqrt(k);
            for (var i=5;i<=m;i+=6) {
                if (k%i===0)     return false;
                if (k%(i+2)===0) return false;
            }
            return true;
        }
    };



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
        $con.append($finalContainer);
        $con.append($numberPad);
        $con.css({
            width: window.innerWidth,
            height: window.innerHeight
        });

        // events
        window.addEventListener("resize", function() {
            $con.css({
                width: window.innerWidth,
                height: window.innerHeight
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
    


    window.app = app;
    return app;

}));
