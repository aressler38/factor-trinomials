define([
    "./example.controller",
    "./templates"
], function(Examples, templates) {

    function Tutorial(config) {
        config = (typeof config === "object") ? config : {};
        var $template   = $(templates.navButtons);
        var examples    = new Examples();
        var $body       = $(document.body);
        var example     = null;
        var oldChild    = null; //buffer
        var container   = (config.containerID) ? document.getElementById(config.containerID) : 
                            document.createElement("div");
        var next        = $template.find("#next")[0];
        var prev        = $template.find("#prev")[0];
        var navWrapper  = $template[0];


        examples.set(-1);
        clickNext();
        $(container).addClass("tutorial container");

        next.addEventListener("click", clickNext);
        prev.addEventListener("click", function() {
            oldChild = example;
            example = examples.prev();
            if (null === example) { console.log("start"); }
            else { 
                appendExample(); 
            }
        });

        function clickNext() {
            oldChild = example;
            example = examples.next();
            if (null === example) { console.log("finished"); }
            else {
                appendExample(); 
            }
        }

        function remove() { document.body.removeChild(container); }
        function insert() { document.body.appendChild(container); }

        function appendExample() {
            container.innerHTML = "";
            container.appendChild(example);
            renderNavButtons();
        }

        function renderNavButtons() {
            var diamondWrapper = container.querySelector(".ft-diamond");
            diamondWrapper.appendChild(navWrapper);
        }

        this.insert = insert;
        this.remove = remove;
    }
    return Tutorial;
});
