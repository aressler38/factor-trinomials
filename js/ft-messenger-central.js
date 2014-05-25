// fg-messenger-central.js coordinates the Messenger with any handles that need to run when 
// custom events are sent. 
//
// copyright (c) 2013 By Alexander Ressler
//
// =========================================================================================


define(
  [
    "./var/appMessenger",
    "./diamond",
    "./rectangle",
    "./var/randomInt",
    "./NumberPad",
    "./var/numpad",
    "./templates",
    "./var/utils",
    "./hints",
    "./model"
  ], function(appMessenger, Diamond, Rectangle, randomInt, NumberPad, numpad, templates, utils, Hints, Model) {

    function FTMessengerCentral() {
        utils.setGlobals(window);
        // STATES
        // 1 := user working on diamond
        // 2 := user working on rectangle
        var state = 1;
        var model = new Model();

        var hints = new Hints();
        hints.render("#factor-trinomials");
        hints[model.get("hints")]();
        
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
            bindRectangleEvents();
            state = 2;
            model.set("state", state);
        }

        /**
         * event handler for rectangle clicks.
         * @callback 
         */
        function rectangleInputHandler(event) {
            $currentRectangle = $(this);
            numpad.clear();
            utils.setNumpad(numpad);
            unselectRectangles();
            $currentRectangle.addClass("selected");
            setAndCheckRectangleElement();
        }

        function setAndCheckRectangleElement() {
            setRectangleElement( insertParsedValue($currentRectangle), $currentRectangle.attr("class") );
            checkRectangleElements();
            fixRectangleElements();
        }

        function setCurrentRectangleElement() {
            setRectangleElement( insertParsedValue($currentRectangle), $currentRectangle.attr("class") );
        }

        function insertParsedValue($currentRectangle) {
            var parsedValue = null;
            var buff = null;
            buff = $currentRectangle.find("span").html();
            if (buff === undefined) { return false; }
            parsedValue = buff.replace(/\+/g,"").replace(/ /g,"");
            $currentRectangle.find("span").html(parsedValue);
            return parsedValue;
        }

        // There's some bug that allows the user to enter a '-' and this program parses it as -1.
        // However the UI registers it as simply '-'. So this method will replace that with -1.
        function fixRectangleElements() {
            $(".ftx1 span,.ftk1 span,.ftx2 span,.ftk2 span").each(function(idx, el) {
                // handle lone '-'
                if (el.innerHTML.trim() === "-") {
                    el.innerHTML += "1";
                }
            });
        }

        function unselectRectangles() {
            $(".ftx1,.ftk1,.ftx2,.ftk2").removeClass("selected");
        }

        function bindRectangleEvents() {
            if (numpad.destroy) {
                numpad.destroy();
            }
            numpad = new NumberPad();

            // insert numpad output in selected rectangle box
            numpad.onenter = function(str, buff) {
                numpad.hide();
                $currentRectangle.find("span").html(str);
                setAndCheckRectangleElement();
                unselectRectangles();
            };
            numpad.onclear = function(str, buff) {
                $currentRectangle.find("span").html("");
            };
            numpad.onclick = function(str, buff) {
                $currentRectangle.find("span").html(str);
                setCurrentRectangleElement();
            };

            $(".ftx1,.ftk1,.ftx2,.ftk2").on("click", rectangleInputHandler);
            appMessenger.on("genericRectangleComplete", function() {
                $(".ftx1,.ftk1,.ftx2,.ftk2").off("click", rectangleInputHandler);
                numpad.hide();
                numpad.destroy();
            });
        }

        // START CHECKING THE RECTANGLE
        function checkRectangleElements() {
            var formattedRectEls = formatInput(rectangleElements);
            var formattedX1 = parseInt(formattedRectEls[0]);
            var formattedX2 = formattedRectEls[2];
            var intX2       = parseInt(formattedX2);
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
            else if (!Number.isNaN(formattedX1)) {
                colorRectangleInput(".ftx1", false);
            }
            // check the x2 slot
            if (!Number.isNaN(intX2) && !Number.isNaN(formattedX1)) { // is it empty?
                if (intX2*formattedX1 === parameters[0]) { // does x1*x2 = ax^2?
                    if (formattedX2.replace(intX2, "").replace(/x/,"") === "" && formattedX2.match(/x/)) { // is there only numbers and an x?
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
            if (!Number.isNaN(intX2) && formattedRectEls[1] !== null) {
                if (formattedRectEls[1].replace(parseInt(formattedRectEls[1]), "") === "" && correctness[2]) { // is there only numbers?
                    // and is the x2 slot correct?
                    if ((parseInt(formattedRectEls[1])*intX2+"x") == (diamondElements[3])){
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
            if (!Number.isNaN(intX2) && formattedRectEls[3] !== null) {
                if (formattedRectEls[3].replace(parseInt(formattedRectEls[3]), "") === "" && correctness[0]) { // is there only numbers?
                    // and is the x2 slot correct?
                    if ((parseInt(formattedRectEls[3])*formattedX1+"x") === (diamondElements[1])){
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
            unselectRectangles();
            var rectEls = appMessenger.send("getRectangleElements");
            rectEls[0] = checkSimpleCases(rectEls[0]);
            rectEls[2] = checkSimpleCases(rectEls[2]);
           
            if (parseInt(rectEls[1]) >= 0) { rectEls[1] = "+"+rectEls[1]; }
            if (parseInt(rectEls[3]) >= 0) { rectEls[3] = "+"+rectEls[3]; }
            
            $(".ft-finalContainer").show();

            var $modal = $(templates.modal);
            $modal.find(".front").html("Great! The factors are exactly: " + "<br/>" + "(" + rectEls[0] + rectEls[1] + ") (" + rectEls[2] + rectEls[3] + ") = " + $(".ft-trinomial span").html() + "<br/> <div><button id=\"next-button\">Next</button><div class=\"your-score\"></div></div>");

            setTimeout(function(){
                $(".ft-finalContainer button").attr("disabled", false);
                $("#next-button").on("click", function() {
                    $(document.body).find(".modal").remove();
                    appMessenger.send("randomize"); 
                });
            },1000);

            model.increment("score");
            model.write();
            $(document.body).append($modal);
            $modal.find(".your-score").html("Score: "+model.get("score"));
            
            
            function checkSimpleCases(str) {
                if (str === "1x"){return "x";}
                if (str === "-1x"){return "-x";}
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
                    
            $(".ftx1, .ftx2, .ftk1, .ftk2").find("span").html("");
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
                    if (false === data[i] || true === data[i]) { return false; }
                    data[i] = data[i].replace("<sup>2</sup>","");
                    data[i] = data[i].replace(/</g,"");    
                    data[i] = data[i].replace(/>/g,"");    
                    data[i] = data[i].replace("/","");    
                    data[i] = data[i].replace(/i/g,"");    
                    data[i] = data[i].replace(/\+/g, "");
                }
                // Handle the case if the coefficient is an implied 1 or an implied -1.
                if (Number.isNaN(parseInt(data[i]))) {
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

        function getParameters(cb) {
            if (typeof cb === "function") {
                cb(polynomial);
            }
            return polynomial;
        }

        function setParameters(a,b,c) {
            if (arguments.length != 3) {throw new Error("Error -- bad parameters?!!!");}
            else {
                polynomial = arguments;
            } 
            return polynomial; 
        }

        /** @deprecated */
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
            console.log("ft-guide: "+msg);
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
            
            //DEPRECATED USAGE
            appMessenger.on("createInputBox", createInputBox);

            appMessenger.send("setMainDiagonal");
            appMessenger.send("onLoad");
            appMessenger.send("clearRectangle");
            state = 1;
            model.set("state", state);
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
                window.setTimeout(function() {
                    $(".ftH span, .fta span, .ftb span, .ftc span, .ftd span").css({
                        "-webkit-transition"    : "all 1s;",
                        "-moz-transition"       : "all 1s",
                        "transition"            : "all 1s"
                    });
                }, 1);
            });
        });
        appMessenger.on("getState", function(callback) {
            return ((typeof callback === "function") ? callback(state) : false, state);
        });
        appMessenger.on("getModel", function(callback) {
            return ((typeof callback === "function") ? callback(model) : false, model);
        });
        // controlls tutorial state
        appMessenger.on("ft-click-state", function(state) {
            model.write("ft-click", state);
        });


    }
    return FTMessengerCentral;
});
