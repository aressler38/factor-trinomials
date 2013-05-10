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


Diamond = (function() {

        var parameters = [1, -17, 30]; // these are the a,b,c that go in ax^2 + bx + c -- set by initialize
        var diamondNumber = {};
        var diamondInputs = [];
        var View_MAX = 350;   // set the max pixels for the diamond's box container

        // jQuery selectors
        var diamondBox1 = ".ft-diamondBox-1"
        var diamondBox2 = ".ft-diamondBox-2"
        var diamondBox3 = ".ft-diamondBox-3"
        var diamondBox4 = ".ft-diamondBox-4"

        var diamondBoxes = [diamondBox1, diamondBox2, diamondBox3, diamondBox4];

        function clean_parameters() {  // for presentational purposes only
            var coefficients =
                   {
                    a:parameters[0],
                    b:parameters[1],
                    c:parameters[2]
                   }
            return (function() {
                
                for (var c in coefficients) {
                    switch (coefficients[c]) {
                        case 1:
                            coefficients[c] = "";
                            break;
                        case -1:
                            coefficients[c] = "- ";
                            break;
                        default:
                            if (coefficients[c] > 0) {
                                coefficients[c] = "+ "+coefficients[c];
                            }
                            else {
                                coefficients[c] = "- "+-1*coefficients[c];
                            }
                    }
                }
                return coefficients;
            }());
        };
        


        // TODO: these event bindings need to be implemented somewhere else... also, modularize this code... at least follow
        // a functional approach. This is ridiculous, think modular ... like oreos.
        //
        // Watch for diamond clicks, this is the hook for the mouse click event on the diamond
        // 
        function events() {
            $(diamondBox1 + ','
              + diamondBox2 + ','
              + diamondBox3 + ','
              + diamondBox4)
                .click(function(e) {
                    createInputBox(e);
                });
        };

        
        // This is the function that will create the input for LaTeX when you click on the diamond.
        // * should only be responsible for creating the input box and printing the MathJax
        function createInputBox(e) {
            $(this.inputBox).remove();
            var svgTarget = e.currentTarget;
            diamondNumber = svgTarget.className.baseVal.replace("ft-diamondBox-", "");
            var coords = [e.clientX, e.clientY];

            $("#ft-diamond-text-"+diamondNumber).remove()

            this.inputBox = document.createElement("input");
            this.expression = document.createElement("span");

            this.inputBox.setAttribute("style",
                                "position:absolute;" +
                                "top:"+coords[1] +"px;"+
                                "left:"+coords[0]+"px;"+
                                "height:50px;" +
                                "width:100px;"+
                                "font-size:22px;"
            );
            this.inputBox.setAttribute("class", "ft-d-input-box")
            $("body").append(this.inputBox);
            this.inputBox.focus();
            // binding a keyup event to the input box
            // use the event to figure out what diamond you clicked and run through a switch
            // CONTINUE ON ENTER (KEY VAL 13)
             $(".ft-d-input-box").keydown(function(e) {
                if(e.which == 13) {
                    setInputBox(e);  
                }
            });
             
        };

        function setInputBox(e) {
                var text = $(this.inputBox).val();
                // Get rid of all the spaces in the user's input text
                if (text.indexOf(" ") != -1) {
                    while (text.indexOf(" ") != -1) {
                        text = text.replace(" ", "");
                    }
                }
                // textCoords is where the text will go
                var textCoords=[null,null];
                

                var svg_container_offset = $(".ft-svg-container").offset();
                
                var localLeft = svg_container_offset.left;
                var localTop = svg_container_offset.top;
                


                switch (parseInt(diamondNumber)) {
                        // Don't ask about these ratios... they're for positioning         
                    case 1:
                        textCoords = [17.0/35.0*View_MAX, 25.0/35.0*View_MAX];
                        break;
                    case 2:
                        textCoords = [8.0/35.0*View_MAX, 17.0/35.0*View_MAX];
                        break;
                    case 3:
                        textCoords = [17.0/35.0*View_MAX, 71.0/350.0*View_MAX]
                        break;
                    case 4:
                        textCoords = [26.0/35.0*View_MAX, 17.0/35.0*View_MAX];
                        break;
                    default:
                        throw "something's wrong with the diamond number."
                }
                this.expression.setAttribute("id", "ft-diamond-text-"+diamondNumber);
                this.expression.setAttribute("style",
                                           "position:absolute;"+ 
                                           "top:"+(textCoords[1])+"px;"+
                                           "left:"+(textCoords[0])+"px;"
                );
                // now write the LaTeX string to the expression and append to body
                this.expression.textContent = "\\(\\Large "+text+"\\)"
                $(".ft-diamond").append(this.expression);
                $(this.inputBox).remove();
                // store what the user just entered in diamondInputs array
                // store text in a 1-1 fashion matching the diamondNumber
                diamondInputs[parseInt(diamondNumber)-1] = text;
                
                // ============
                // Check Values
                // ============

                diamondInputs = formatDiamondInput(diamondInputs);
                checkDiamondInputs(diamondInputs);
                // Lastly, render the LaTeX via MathJax...yes!
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, String("ft-diamond-text-"+diamondNumber)]);
        };
        
        function formatDiamondInput(data) {
            for (var i=0; i<4; i++) {
                if (typeof(data[i]) == "undefined") {
                    continue;
                }
                // Handle the case if the coefficient is an implied 1 or an implied -1.
                if (isNaN(parseInt(data[i]))) {
                    switch (data[i][0]) {
                        case "x":
                            return "-1"+data[i];
                            break;
                        case "-":
                            return data[i].replace("-","-1");
                            break;
                        default:
                            Messenger.send("ft-guide", "There's something wrong with what you entered. "
                                    + "I was expecting the expression to start with x or -x");
                    }
                }
            }
            return data;
        };

        // This for loop is where I check the diamondInputs against the parameters.
        // I'm going to color the diamond parts here.
        function checkDiamondInputs(dFormatted) {
            for (var i=0; i<4; i++) {
                if (!dFormatted[i] || !dFormatted[i].match('x')) {
                    Messenger.send("ft-guide", "Make sure you are using the correct variable.");
                    continue;
                }
                switch (i) {
                    // bottom square --- match middle term
                    case 0:
                        if (dFormatted[0] != (parameters[1]+'x')) {
                            Messenger.send("ft-guide", "That is not the correct value for the sum.");
                            Messenger.send("ft-d-eval", {0:false});
                            break;
                        }
                        else {
                            Messenger.send("ft-d-eval", {0:true});
                        }
                        break;
                    case 1:
                        if ((parseInt(dFormatted[1])+parseInt(dFormatted[3])+'x') != (parameters[1]+'x')) {
                            Messenger.send("ft-guide", "The left and right diamond inputs don't add up to the correct value.");
                            Messenger.send("ft-d-eval", {1:false, 3:false});
                        }
                        else {
                            Messenger.send("ft-d-eval", {1:true, 3:true});
                            Messenger.send("ft-guide", "It looks like the sum is correct!")
                        }
                        break;
                    // top square --- if product isn't correct
                    case 2:
                        if (dFormatted[2] != ((parameters[0]*parameters[2])+"x^2")) {
                            Messenger.send("ft-d-eval", {2:false});
                        }
                        else {
                            Messenger.send("ft-guide", ("the product was correct: "+dFormatted[i]));
                            Messenger.send("ft-d-eval", {2:true});
                        }
                        break;
                    // right square --- if sum doesn't add up
                    case 3:
                        if ((parseInt(dFormatted[1])+parseInt(dFormatted[3])+'x') != (parameters[1]+'x')) {
                            Messenger.send("ft-guide", "The left and right diamond inputs don't add up to the correct value.");
                            Messenger.send("ft-d-eval", {1:false, 3:false});
                        }
                        else {
                            Messenger.send("ft-d-eval", {1:true, 3:true});
                        }
                        break;
                    default:
                        console.log("Something is seriously wrong... contact tech support");
                        throw "Error while parsing index in checkDiamondInputs";
                }
            }
        };  

        return {

            initialize: function(_p1, _p2, _p3) {
                if (typeof(_p1) == "number" && typeof(_p2) == "number" && typeof(_p3) == "number") {
                    parameters = [_p1, _p2, _p3];
                }           
               
                var coefficients = clean_parameters();
                $(".ft-trinomial").html("Factor the following trinomial: &nbsp;"
                                        + "<span class='ft-trinomial-equation' style='font-size:22px'>"                          
                                        + coefficients.a+"<em>x</em><sup>2</sup> "
                                        + coefficients.b+"<em>x</em> "
                                        + coefficients.c 
                                        + "</span>"
                );
                
                // setup for the diamond
                var xmlns="http://www.w3.org/2000/svg";
                var diamondPartLength =  Math.floor(View_MAX * Math.sqrt(2.0)/4.0);
                    
                // Grab the html containers and set up the dimensions based on View_MAX
                $(".ft-diamond")[0].setAttribute("style", "width:" + View_MAX + "px;" + "height:" + View_MAX + "px;");
                $(".ft-svg-container")[0].setAttribute("style", "width:" + View_MAX + "px;" + "height:" + View_MAX + "px;");
                $(".ft-svg-container")[0].setAttribute("viewBox", "0 0 " + View_MAX + " " + View_MAX);
                
                // Make 4 inner squares and rotate them accordingly to make the diamond
                // Here's the setup structure according to class suffix (1,2,3, or 4)
                //          3
                //        2   4  
                //          1
                for (var i=0; i<4; i++) {
                    var angle = 45 + i*90;
                    var diamondPart = document.createElementNS(xmlns, "rect");
                    diamondPart.setAttribute("class", "ft-diamondBox-"+(i+1)); // assign classes to each box
                    diamondPart.setAttribute("x", View_MAX/2.0);
                    diamondPart.setAttribute("y", View_MAX/2.0);
                    diamondPart.setAttribute("width", diamondPartLength);
                    diamondPart.setAttribute("height", diamondPartLength);
                    diamondPart.setAttribute("transform", "rotate(" + angle + " " + View_MAX/2.0 + " " + View_MAX/2.0 + ")");
                    diamondPart.setAttribute("style", "stroke-width:3; stroke:blue; fill:white;");
                    $(".ft-svg-container").append(diamondPart);
                }
                 
                // =============
                // Event Binding
                // =============

                events();

                return null;
            },

            clearDiamondInput: function(n) {
                if (typeof(n) == "undefined") {
                    Messenger.send("ft-d-eval", "clear all");
                    for (var i=1; i<5; i++) {
                        $("#ft-diamond-text-"+i).remove()
                        $(diamondBoxes[i-1]).css("fill", "None");
                        return null;
                    }
                }
                else if (typeof(n) == "number") {
                    Messenger.send("ft-d-eval", "clear "+n);
                    for (var i=0; i<4; i++) {
                        if (diamondBoxes[i].match('['+n+']') != null) {
                            $("#ft-diamond-text-"+i).remove()
                            $(diamondBoxes[i]).css("fill", "None");
                        }
                    }
                    return null;
                }
            },
            
            colorDiamondInput: function(n, color, alpha) {
                if (typeof(n) == "undefined") {throw new Error("Expecting to color a specific diamond.");}
                if (typeof(color) == "undefined") {throw new Error("Expecting a color.");}
                var opacity = (typeof(alpha) == "undefined") ? 0.6 : alpha;
                if (n > 0 && n < 5) {
                        $(diamondBoxes[n-1]).css("fill", color);
                        $(diamondBoxes[n-1]).css("fill-opacity", opacity);
                    return null;
                }
                else {
                    throw new Error("colorDiamondInput out of range. Expecting range 1-4.");
                }

            }
        }
    
}());
// TODO: 
/*
    * Make the area of the diamond fill green when the user's input is correct, and make the diamond fill red when the user input is incorrect.
    * Once the two numbers that satisfy the product-sum rule are entered correctly:
        - animate those two numbers to the generic rectangle cells.
    * Students could enter the factors on the outer part of the generic rectangle.
    * Finally, students could enter their factored expression and click a submit button to see if they      are correct.
*/
