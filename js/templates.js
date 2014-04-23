define([
    "./text!../html/templates/number-pad.html",
    "./text!../html/templates/nav-buttons.html"
], function(numberPadTemplate, navButtonsTemplate) {
    // NOTE: don't change the name of the 'templates' var
    var templates = {
        numberPadTemplate: numberPadTemplate,
        navButtonsTemplate: navButtonsTemplate
    };
    return templates;
});
