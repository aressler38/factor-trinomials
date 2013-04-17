
// Wait!
// I have some variables that need explaining...
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




Diamond = {
            
    parameters:[1, -17, 30], // these are the a,b,c that go in ax^2 + bx + c -- set by initialize
    
    clean_parameters : function() {  // for presentational purposes only
        var coefficients =
               {
                a:this.parameters[0],
                b:this.parameters[1],
                c:this.parameters[2]
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

    },
    
    initialize: function(parameters) {
        if (typeof(log) == "undefined") {
            window.log = function(m){console.log(m);};
        }
        if (parameters) {
            this.parameters = parameters;
        }
        log("init");
        var coefficients = this.clean_parameters();
        $(".ft-trinomial").html("Factor the following trinomial: &nbsp;"+
                                "<span class='ft-trinomial-equation' style='font-size:22px'>"+                          
                                coefficients.a+"<em>x</em><sup>2</sup> "+
                                coefficients.b+"<em>x</em> "+
                                coefficients.c +
                                "</span>"
        );
        
        // setup for the diamond
        this.diamondInputs = [];
        var xmlns="http://www.w3.org/2000/svg";
        this.View_MAX = 350;   // set the max pixels for the diamond's box container
        var diamondPartLength =  Math.floor(this.View_MAX * Math.sqrt(2.0)/4.0);
            
        // Grab the html containers and set up the dimensions based on View_MAX
        $(".ft-diamond")[0].setAttribute("style", "width:" + this.View_MAX + "px;" + "height:" + this.View_MAX + "px;");
        $(".ft-svg-container")[0].setAttribute("style", "width:" + this.View_MAX + "px;" + "height:" + this.View_MAX + "px;");
        $(".ft-svg-container")[0].setAttribute("viewBox", "0 0 " + this.View_MAX + " " + this.View_MAX);
        
        // Make 4 inner squares and rotate them accordingly to make the diamond
        // Here's the setup structure according to class suffix (1,2,3, or 4)
        //          3
        //        2   4  
        //          1
        for (var i=0; i<4; i++) {
            var angle = 45 + i*90;
            var diamondPart = document.createElementNS(xmlns, "rect");
            diamondPart.setAttribute("class", "ft-diamondBox-"+(i+1)); // assign classes to each box
            diamondPart.setAttribute("x", this.View_MAX/2.0);
            diamondPart.setAttribute("y", this.View_MAX/2.0);
            diamondPart.setAttribute("width", diamondPartLength);
            diamondPart.setAttribute("height", diamondPartLength);
            diamondPart.setAttribute("transform", "rotate(" + angle + " " + this.View_MAX/2.0 + " " + this.View_MAX/2.0 + ")");
            diamondPart.setAttribute("style", "stroke-width:3; stroke:blue; fill:white;");
            $(".ft-svg-container").append(diamondPart);
        }
        
        
        log("you need to bind events here... NOW!");
        log("try calling this.events")
    },
    
    // TODO: these event bindings need to be implemented somewhere else... also, modularize this code... at least follow
    // a functional approach. This is ridiculous, think modular ... like oreos.
    //
    // Watch for diamond clicks, this is the hook for the mouse click event on the diamond
    // 
    events: function(){
        var that=this;
        $(".ft-diamondBox-1, .ft-diamondBox-2, .ft-diamondBox-3, .ft-diamondBox-4").click(function(e){that.createInputBox(e);});
    },

    // This is the function that will create the input for LaTeX when you click on the diamond.
    // Previously, I had been overloading this method: this method should only be responsible for creating the 
    // input box and printing the MathJax when the user hits enter (key 13)
    createInputBox: function(e) {
        var that = this;
        log(e)
        log(that)
        // first... i'm gonna ... remove the old inputBox
        $(this.inputBox).remove();
        // then... i'm gonna use you as a human shield, *cough* i mean figure out your class name
        var svgTarget = e.currentTarget;
        var diamondNumber = svgTarget.className.baseVal.replace("ft-diamondBox-", "");
        var coords = [e.clientX, e.clientY];
         
        $("#ft-diamond-text-"+diamondNumber).remove()

        this.inputBox = document.createElement("input");
        var expression = document.createElement("span");
                               
        this.inputBox.setAttribute("style",
                            "position:absolute;" +
                            "top:"+coords[1] +"px;"+
                            "left:"+coords[0]+"px;"+
                            "height:50px;" +
                            "width:100px;"+
                            "font-size:22px;"
        );
        $("body").append(this.inputBox);
        this.inputBox.focus();
        
        // binding a keyup event to the input box
        // use the event to figure out what diamond you clicked and run through a switch
        // CONTINUE ON ENTER (KEY VAL 13)
        $(this.inputBox).keyup(function(e){
            if (e.which == 13) {
                var text = $(that.inputBox).val();
                // Get rid of all the spaces in the user's input text
                if (text.indexOf(" ") != -1) {
                    while (text.indexOf(" ") != -1) {
                        text = text.replace(" ", "");
                    }
                }
                // textCoords is where the text will go
                var textCoords=[null,null];
                
                switch (parseInt(diamondNumber)) {
                        // Don't ask about these ratios... they're for positioning         
                    case 1:
                        textCoords = [17.0/35.0*that.View_MAX, 30.0/35.0*that.View_MAX];
                        break;
                    case 2:
                        textCoords = [8.0/35.0*that.View_MAX, 22.0/35.0*that.View_MAX];                           
                        break;
                    case 3:
                        textCoords = [17.0/35.0*that.View_MAX, 121.0/350.0*that.View_MAX]
                        break;
                    case 4:
                        textCoords = [26.0/35.0*that.View_MAX, 22.0/35.0*that.View_MAX];
                        break;
                    default:
                        throw "something's wrong with the diamond number."
                    
                }
                expression.setAttribute("id", "ft-diamond-text-"+diamondNumber);
                expression.setAttribute("style",
                                           "position:absolute;"+ 
                                           "top:"+textCoords[1]+"px;"+
                                           "left:"+textCoords[0]+"px;"
                );
                
                // now write the LaTeX string to the expression and append to body
                expression.textContent = "\\(\\Large "+text+"\\)"
                $("body").append(expression);
                $(that.inputBox).remove();
                
                // store what the user just entered in diamondInputs array
                // store text in a 1-1 fashion matching the diamondNumber
                that.diamondInputs[parseInt(diamondNumber)-1] = text;
                               
                // I need to start checking the diamond inputs here and this method needs
                // to return an array          

//TODO!!!!          log("MAKE SURE YOU CHECK WHAT HAPPENS RIGHT AFTER THIS LOG MESSAGE");
                that.diamondInputs = that.readDiamondInput(that.diamondInputs);

                // This function reads the input of a diamond and looks at the coefficient.
                // It sees if you entered just "x" instead of "1x" or "-x" instead of "-1x".

                // Lastly, render the LaTeX via MathJax...yes!
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, String("ft-diamond-text-"+diamondNumber)]);
                //MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            }
        });
    },

    readDiamondInput: function(data) {
        for (var i=0; i<4; i++) {
            if (typeof(data[i]) == "undefined") {
                log("one of the data elements is undefined... skipping.")
                continue;
            }
            // Handle the case if the coefficient is an implied 1 or an implied -1.
            if (isNaN(parseInt(data[i]))) {
                switch (data[i][0]) {
                    case "x":
                        return 1;
                        break;
                    case "-":
                        return -1;
                        break;
                    default:
                        log("There's something wrong with what you entered. I was expecting the expression to start with x or -x");
                        log("You entered: '"+data[i][0]+"'");
                        //throw "Error in readDiamondInput: data["+i+"][0] not recognized.";
                }
            }
            else {
                data[i] = parseInt(data[i]);
                log("I have recognized the coefficient: "+data[i]);
            }
        }
        return data;
    },

    // This for loop is where I check the diamondInputs against the parameters.
    // I'm going to color the diamond parts here.
    check_diamond_inputs: function(dParsed){
        // TODO: add a hook that checks if the entire diamond is ok
        // then create the rectangle and finsish this beast.
        //
        for (var i=0; i<4; i++) {
            //var dParsed = readDiamondInput(that.diamondInputs[i]);
            log("You entered: " + dParsed[i]);
            switch (i) {
                case 0:
                    if (dParsed[i] != parameters[1]) {
                        log("That is not the correct value for the sum.");
                    }
                    else {
                        log(dParsed[i] + " is the correct value for the sum");
                    }
                    break;
                case 1:
                // you're storing things as strings...not ints
                    break;
                case 2:
                    if (dParsed[i] != parameters[0]*parameters[2]) {
                        log("I was expecting "+parameters[0]*parameters[2]+" for the product");
                    }
                    else {
                        log("the product was correct: "+dParsed[i]);  
                    }
                    break;
                case 3:
                    log("the sum of the sides is "+this.diamondInputs[1]+this.diamondInputs[3]); 
                    break;
                default:
                    log("Something is seriously wrong... contact tech support");
                    throw "Error while parsing index in check_diamond_inputs";
            }
        }
    }



    
}
// TODO: 
/*
    * Make the are of the diamond fill green when the user's input is correct, and make the diamond fill red when the user input is incorrect.
    * Once the two numbers that satisfy the product-sum rule are entered correctly:
        - animate those two numbers to the generic rectangle cells.
    * Students could enter the factors on the outer part of the generic rectangle.
    * Finally, students could enter their factored expression and click a submit button to see if they      are correct.
*/
