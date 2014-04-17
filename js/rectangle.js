// rectangle.js is a file associated with the factor-trinomial 
// browser application. It role is to set up a diamond, which
// aids in the factoring of a trinomial. 
//
// copyright (c) 2013 By Alexander Ressler
//
// ================================================================================================


define([
        "jquery",
        "js/appMessenger", 
        "js/diamond",
        "js/var/ifOneOrNegOne",
        "js/var/prettifySign"
    ], function($, Messenger, Diamond, ifOneOrNegOne, prettifySign) {

    var Rectangle = (new function() {

        // add <input> to rectangle divs
        var container = document.getElementsByClassName("ft-rectangle")[0];
        
        Messenger.on("setMainDiagonal", function(){
            var parameters = Messenger.send("getParameters");
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
        };
    });
    return Rectangle;
});










