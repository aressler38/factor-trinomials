define(function() {

    /**
     * @constructor
     */
    function Model(config) {
        if (typeof localStorage !== "object") {
            alert("localStorage is unavailable");
        }
        config = (typeof config !== "object") ? {} : config;
        config = $.extend(true, {
            "db": {
                "name": "factorQuadratics",
                "type": "localStorage"
            },
            "model": {
                "hints": "on",
                "score": 0
            }
        }, config);
        var model = {};

        /** @private */
        function initialize () {
            this.read();
            model = $.extend(true, config.model, model);
            this._old = false;
        }

        // warning, objects are passed by reference.
        this.set = function(key, val) {
            model[key] = val;
            this._old = true;
        };

        this.get = function(key) {
            return model[key];
        };

        this.save = function() {
            this._old = false;
            localStorage[config.db.name] = JSON.stringify(model);
        };

        this.read = function() {
            if (undefined === localStorage[config.db.name]) { return model; }
            model = JSON.parse(localStorage[config.db.name]);
            return model;
        };

        this.write = function() {
            if (arguments.length===0) { return this.save(); }
            this.set.apply(this, arguments);
            this.save();
        };

        this.increment = function(key) {
            this.set(key, parseInt(this.get(key)) + 1);
        };

        this.dump = function() {
            model = {};
            delete localStorage[config.db.name];
        };

        initialize.call(this);
    }
    return Model;
});
