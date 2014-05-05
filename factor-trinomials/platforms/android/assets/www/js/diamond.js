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