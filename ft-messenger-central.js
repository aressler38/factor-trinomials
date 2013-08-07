// fg-messenger-central.js coordinates the Messenger with any handles that need to run when 
// custom events are sent. 
//
// copyright (c) 2013 By Alexander Ressler
//
// =========================================================================================




(function() {
    
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

    function evaluateDiamond(dInput) {
        $.extend(diamond, dInput[0]);
        
        // Check the middle terms (1) and (3)
        if (diamond['1'] && diamond['3']) {
            Diamond.colorDiamondInput(2, "green");
            Diamond.colorDiamondInput(4, "green");
        }
        else {
            if (diamond['1'] != null && diamond['3'] != null) {
                Diamond.colorDiamondInput(2, "red");
                Diamond.colorDiamondInput(4, "red");
            }
        }

        // Check the SUM term... the bottom one
        if (diamond['0'] != null) {
            if (diamond['0']) {
                Diamond.colorDiamondInput(1, "green");
            }
            else {
                Diamond.colorDiamondInput(1, "red");    
            }
        }
        
        // Check the PRODUCT term... the top one
        if (diamond['2'] != null) {
            if (diamond['2']) {
                Diamond.colorDiamondInput(3, "green");
            }
            else {
                Diamond.colorDiamondInput(3, "red"); 
            }
        }
        
        // Check all the terms
        if (diamond['0'] && diamond['1'] && diamond['2'] && diamond['3']) {
            Messenger.off("createInputBox");
            Messenger.send("diamondCorrect");
        }
    };
    
    function diamondCorrect() {
        console.log("calling diamondCorrect");
        $(".ftH span").removeClass("hide");  
        $(".ftb span").html($("#ft-diamond-text-2").html());
        $(".ftc span").html($("#ft-diamond-text-4").html());
        // show inner rectangle
        $(".fta span").removeClass("hide");
        $(".ftd span").removeClass("hide");
        $(".ftb span").removeClass("hide");
        $(".ftc span").removeClass("hide");
        
        diamondElements = formatInput( getDiamondElements() );
        console.log("")
        console.log(diamondElements);
        console.log("")
        console.log("")
        console.log("the GCF of the top row is: "+getTopRowGCF());

        $(".ftx1,.ftk1,.ftx2,.ftk2").bind("click", createRectangleInput);
    };


    function createRectangleInput(e) {
        var target = e.currentTarget;
        var input = document.createElement("input");
        $(target).html(input);
        $(input).focus();
        $(input).bind("keyup", function(e){
            if (e.which == 13) {
                setRectangleInput.call(this,target);
            }
        });
        $(input).bind("blur", function(e){
            setRectangleInput.call(this,target);
        });
    };

    function setRectangleInput(target) {
        var parsedValue = this.value.replace(/\+/g,"").replace(/ /g,"");
        $(target).html(renderMath(parsedValue));
        setRectangleElement(parsedValue, $(target).attr("class"));
        checkRectangleElements();
    };
     
    // START CHECKING THE RECTANGLE
    function checkRectangleElements() {
        var formattedRectEls = formatInput(rectangleElements);
        var formattedX1 = parseInt(formattedRectEls[0]);
        var formattedX2 = formattedRectEls[2];
        var topRowGCF = getTopRowGCF();
        var parameters = Messenger.send("getParameters");
        var aIsNegative = (parameters[0] < 0) ? true : false;
        var diamondElements = Messenger.send("getDiamondElements");
        

        var correctness = [false, false, false, false]; // x1, k1, x2, k2

        console.log(formattedRectEls);
        
        // check the GCF slot in $(".ftx1")
        if (formattedX1 == topRowGCF) {
            if (rectangleElements[0] == (topRowGCF+"x")) {
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
        if (!isNaN(parseInt(formattedX2)) && !isNaN(formattedX1)) { // is it empty?
            console.log(parseInt(formattedX2)*parseInt(formattedX1) )
            if (parseInt(formattedX2)*parseInt(formattedX1) == parameters[0]) { // does x1*x2 = ax^2?
                console.log(formattedX2);
                console.log(formattedX2.replace(parseInt(formattedX2), "").replace(/x/,"") )
                if (formattedX2.replace(parseInt(formattedX2), "").replace(/x/,"") == "" && formattedX2.match(/x/)) { // is there only numbers and an x?
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
        console.log(diamondElements);console.log(correctness);
        if (!isNaN(parseInt(formattedX2)) && formattedRectEls[1] != null) {
            if (formattedRectEls[1].replace(parseInt(formattedRectEls[1]), "") == "" && correctness[2]) { // is there only numbers?
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
        if (!isNaN(parseInt(formattedX2)) && formattedRectEls[3] != null) {
            if (formattedRectEls[3].replace(parseInt(formattedRectEls[3]), "") == "" && correctness[0]) { // is there only numbers?
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
            Messenger.send("genericRectangleComplete");
        }
    };

    function genericRectangleComplete() {
        console.log("YAYAA!!!");
        var rectEls = Messenger.send("getRectangleElements");
        rectEls[0] = checkSimpleCases(rectEls[0]);
        rectEls[2] = checkSimpleCases(rectEls[2]);
       
        if (parseInt(rectEls[1]) >= 0){rectEls[1] = "+"+rectEls[1];}
        if (parseInt(rectEls[3]) >= 0){rectEls[3] = "+"+rectEls[3];}
        
        
        $(".ft-finalContainer").show();
        $(".ft-finalContainer .explanationArea").html("Great! The factors are exactly: "
            + "<br>"
            + "(" + rectEls[0] + rectEls[1] + ") (" + rectEls[2] + rectEls[3] + ") = " + $(".ft-trinomial span").html()
            + "<br>"
        );

        setTimeout(function(){
            $(".ft-finalContainer button").attr("disabled", false);
        },1000)
        
        function checkSimpleCases(str) {
            if (str == "1x"){return "x";}
            if (str == "-1x"){return "-x";}
            return str;
        }
        
    };
    
    function colorRectangleInput($selector, bool) {
        if (bool) {
            $($selector).css({"background":"rgba(0,255,0,0.6)"})
        }
        else {
            $($selector).css({"background":"rgba(255,0,0,0.6)"})
        }
    }

    function clearRectangleInputs() {
        $(".ftx1, .ftx2, .ftk1, .ftk2").css({"background":"None"});
        $(".ftx1, .ftx2, .ftk1, .ftk2").html("");
    }

    function getTopRowGCF() {
        var a11 = Math.abs( Messenger.send("getParameters")[0] ); // this is a number 
        var a12 = diamondElements[1]; // this is a string... need to parseInt
        var a12Parsed = Math.abs( parseInt(a12) );

         
        if (a11 == 1 || a12Parsed == 1) { 
            return 1;
        }
        else {
            var a11p = Math.primeFactors(Math.abs(a11));
            var a12p = Math.primeFactors(a12Parsed);
            console.log(a11p);console.log(a12p);
            return getGCF(a11p, a12p); 
        }
    };

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
        };
        
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
        };
    
        //==========================================================
        for (var i=0; i<a1Len; i++) {
            bases1[i] = a1[i][0];
        }
        for (var i=0; i<a2Len; i++) {
            bases2[i] = a2[i][0];
        }

        // here's the array of bases that are common to a1 and a2
        var matchingBases       = findMatchingElements(bases1,bases2);
        var matchingBasesLen    = matchingBases.length;
        var matchedBase         = 1;
        var minExp              = 1;
        var GCF                 = 1;
        var testGCF             = 1;
        
        console.log(matchingBases);
        // time to go through the matches, and compare the associated exponents 
        // we're taking the shortest route... if a1Len < a2Len then ..., else ... 
        for (var i=0; i<matchingBasesLen; i++) {
            if (a1lenLessThanA2) {
                for (var j=0; j<a1Len; j++) {
                    if (a1[j][0] == matchingBases[i]) {
                        // we have a match...
                        matchedBase = a1[j][0] 
                        // now compare the exponnents: min(a1[j][1], findBaseExp(a2,a1[j][0]))
                        minExp = Math.min(a1[j][1], findBaseExp(a2, matchedBase));
                        testGCF = Math.pow(matchedBase, minExp);

                        console.log(testGCF);console.log(minExp);
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
                for (var j=0; j<a2Len; j++) {
                    if (a2[j][0] == matchingBases[i]) {
                        // we have a match...
                        matchedBase = a2[j][0] 
                        // now compare the exponnents: min(a1[j][1], findBaseExp(a2,a1[j][0]))
                        minExp = Math.min(a2[j][1], findBaseExp(a1, matchedBase));
                        testGCF = Math.pow(matchedBase, minExp);
                        console.log(testGCF);console.log(minExp);
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
    };

    // array in ... array out
    function formatInput(data) {
        for (var i=0; i<4; i++) {
            if (typeof data[i] == "undefined" || data[i] == null) {
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
            console.log(data[i]);
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
                        Messenger.send("ft-guide", "There's something wrong with what you entered. "
                                + "I was expecting the expression to start with x or -x");
                }
            }
        }
        return data;
    };

    // return a random integer in [min, max]
    function randomInt(min,max, withZero) {
        if (withZero) {
            var rand = Math.random();
            var randInt = Math.round(min + rand*(max-min));
            return randInt;
        }
        else {
            var rand = Math.random();
            var randInt = Math.round(min + rand*(max-min));
            while (randInt == 0) {
                rand = Math.random();
                randInt = Math.round(min + rand*(max-min));
            }
            return randInt;
        }
    };

    function setRectangleElement(str, className) {
        switch (className) {
            case ("ftx1"):
                rectangleElements[0] = str;
                break;
            case ("ftk1"):
                rectangleElements[1] = str;
                break;
            case ("ftx2"):
                rectangleElements[2] = str;
                break;
            case ("ftk2"):
                rectangleElements[3] = str;
                break;
            default:
                throw new Error("there's no matching class name when setting rectangle inputs");
        }
    };

    function getParameters() {
        return polynomial;
    };

    function setParameters(x) {
        if (x.length != 3) {throw new Error("Error -- bad parameters?!!!");}
        else {
            for(var i=0; i<3; i++) {
                polynomial[i] = x[i];
            }
        } 
        return polynomial; 
    };

    function createInputBox(args) {
        args[1](args[0]);// Wow this isn't human-readable, but it's something in diamond.js.
    };

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
    };

    function getDiamondElements() {
        for (var i=0; i<4; i++) {
            diamondElements[i] = $("#ft-diamond-text-"+(i+1)).html();
        }
        return diamondElements;
    }

    function guide(msg) {
        console.log("you are logging to ft-guide: "+msg)
    };
    
    // ===========================================================================================
    Messenger.on("ft-randomize", function() {
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
        Messenger.send("ft-initialize", (a*c), (a*d+b*c), (b*d));
    });
    
    // give this an array... params := Array(a,b,c)
    Messenger.on("ft-initialize", function(params) {
        rectangleElements = [null,null,null,null];
        diamondElements = ["1", "2", "3", "4"];
        diamond = {
                0:null,
                1:null,
                2:null,
                3:null
        };
        if (!params || params.length != 3) {
            Diamond.initialize();
        }
        else {
            Diamond.initialize(params[0],params[1],params[2]);
        }
        
        Messenger.on("createInputBox", createInputBox);
        Messenger.send("setMainDiagonal");
        Messenger.send("onLoad");
        Messenger.send("clearRectangle");
        
    });

    

    Messenger.on("ft-guide", guide);
    Messenger.on("ft-d-eval", evaluateDiamond);
    Messenger.on("getParameters", getParameters);
    Messenger.on("setParameters", setParameters);
    Messenger.on("diamondCorrect", diamondCorrect);
    Messenger.on("getDiamondElements", function(){return diamondElements;});
    Messenger.on("getRectangleElements", function(){return rectangleElements;});
    Messenger.on("clearRectangle", clearRectangleInputs);
    Messenger.on("genericRectangleComplete", genericRectangleComplete);

    Messenger.on("onLoad", function() {
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

}());
