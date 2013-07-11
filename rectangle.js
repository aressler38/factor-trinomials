// rectangle.js is a file associated with the factor-trinomial 
// browser application. It role is to set up a diamond, which
// aids in the factoring of a trinomial. 
//
// copyright (c) 2013 By Alexander Ressler
//
// ================================================================================================



Rectangle = new function() {

    var outerSpace = {
        //   a b
        // c w x
        // d y z
        

    };

    // add <input> to rectangle divs
    var container = document.getElementsByClassName("ft-rectangle")[0];
    
    // setup 
    var inputs = [

    ];

    function showAltDiagonal() {
        
    };

    $(function(){
        var parameters = Messenger.send("getParameters");
        var polynomial = clean_parameters(parameters);
        
        $(".fta").html("<span>"+polynomial.a+"<i>x</i><sup>2</sup></span>");
        $(".ftd").html("<span>"+parameters[2]+"</span>");
    });

    Messenger.on("showAltRectangle", showAltDiagonal); 

    
    
    //copied from diamond.js... maybe you should make a helpers file 
    function clean_parameters(parameters) {  // for presentational purposes only
        var coefficients =
               {
                a:parameters[0],
                b:parameters[1],
                c:parameters[2]
               };

        function ifOneOrNegOne(x, showOne) {
            if (x == 1) {
                if (showOne) { 
                    return "+ 1";
                }
                else {
                    return "+ ";
                }
            }
            if (x == -1) {
                if (showOne) {
                    return "- 1";
                }
                else {
                    return "- ";
                }
            }
            // otherwise return 
            return x;
        };
        function prettifySign(x) {
            if (typeof x == "string") {
                var _x = x.replace(/ /g, ''); // remove whitespace
                _x = parseInt(_x);
                if (isNaN(_x)){return x;};
            }
            else {
                var _x = x;
            }
            console.log(" the _x is: " + _x);
            if ((_x) >= 0) {
                return "+ "+ _x;
            }
            else {
                return "- " + (-1*_x);
            }
            return x;
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
};










