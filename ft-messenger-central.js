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
        $(".ftH span").removeClass("hide");  
        // show inner rectangle
        $(".fta span").removeClass("hide");
        $(".ftd span").removeClass("hide");
        
        $(".ftx1,.ftk1,.ftx2,.ftk2").bind("click", createRectangleInput);
    };


    function createRectangleInput(e) {
        var target = e.currentTarget;
        var input = document.createElement("input");
        $(target).html(input);
        $(input).focus();
        
        $(input).bind("keyup", function(e){
            if (e.which == 13) {
                $(target).html(renderMath(this.value))
            }
        });
        $(input).bind("blur", function(e){
            $(target).html(this.value)
        });
    };

    function guide(msg) {
        console.log("you are logging to ft-guide: "+msg)
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
            throw new Error("The text is supposed to have a regex match method.");
        }
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
        Messenger.send("onLoad");
    });

    

    Messenger.on("ft-guide", guide);
    Messenger.on("ft-d-eval", evaluateDiamond);
    Messenger.on("getParameters", getParameters);
    Messenger.on("setParameters", setParameters);
    Messenger.on("diamondCorrect", diamondCorrect);

    Messenger.on("onLoad", function(){
        $(function(){
            $(".ftH span").addClass("hide");  
            $(".fta span").addClass("hide");
            $(".ftd span").addClass("hide");
            window.setTimeout(function(){
                $(".ftH span, .fta span, .ftd span").css({
                    "-webkit-transition"    : "all 1s;",
                    "-moz-transition"       : "all 1s",
                    "transition"            : "all 1s"
                });
            },1);
        });
    });

    //TODO: test
    Messenger.on("test", function(x){console.log(x);console.log(x.length);});
}());
