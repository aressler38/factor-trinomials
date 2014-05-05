define([

    "./text!../html/templates/number-pad.html",
    "./text!../html/templates/nav-buttons.html",
    "./text!../html/templates/header.html",
    "./text!../html/templates/finalContainer.html",
    "./text!../html/templates/rectangle.html",
    "./text!../html/templates/diamond.html",
    "./text!../html/templates/trinomial.html"
    
], function(numberPad, navButtons, header, finalContainer, rectangle, diamond, trinomial ) {
    // TODO: can't have a line break in the function argument!!!!

    // NOTE: don't change the name of the 'templates' var, and you need to 
    // be really strict with this file: 
    // keep all the naming conventions the same
    var templates = {
        numberPad       : numberPad,
        navButtons      : navButtons,
        header          : header,
        finalContainer  : finalContainer,
        rectangle       : rectangle,
        diamond         : diamond,
        trinomial       : trinomial
    };
    return templates;
});
