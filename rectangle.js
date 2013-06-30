// rectangle.js is a file associated with the factor-trinomial 
// browser application. It role is to set up a diamond, which
// aids in the factoring of a trinomial. 
//
// copyright (c) 2013 By Alexander Ressler
//
// ================================================================================================



Rectangle = (function() {

    var x,y,z;



    function drawRectangle() {
        

        var rectangleId = "ft-rectangle";
        var rectangle_parent = document.getElementById(rectangleId);  
        var container = document.createElement("div");

        var containerStyleAttributes = function(attributes){
            var string = "";
            var attributes = {
                "float":"left",
                "width":"350px",
                "height":"350px",
                "border":"2px solid black"
            }
            for (var i in attributes) {
                string += i+':'+attributes[i]+';'; 
            }
            return string;
        };




        rectangle_parent.appendChild(container);
        container.setAttribute("style", containerStyleAttributes());
    }


    return function() {

        $(function(){
            drawRectangle();
        });
    }





}())










