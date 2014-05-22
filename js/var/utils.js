define([
    "./appMessenger"
],function(appMessenger) {
    return ({
        setNumpad: function(np) {
            var s = 0; // shift 
            var b = 10; // base
            var w = window.innerWidth;
            var state = null;
            appMessenger.send("getState", function(s) { state = s; });
            if (state === 2) {
                if      (w < 520)   { s=190; np.show([b+s, 50]); }
                else if (w < 741)   { s=220; np.show([b+s, 70]); }
                else                { s=350; np.show([b+s, 220]); }
            }
            else {
                if      (w < 520)   { np.show([b+s-10, 50]); }
                else if (w < 741)   { np.show([b+s, 70]); }
                else                { s=120; np.show([b+s, 220]); }
            }
        },
        setGlobals: function (global) {
            var global_isNaN = global.isNaN;
            Object.defineProperty(Number, 'isNaN', {
                value: function isNaN(value) {
                    return typeof value === 'number' && global_isNaN(value);
                },
                configurable: true,
                enumerable: false,
                writable: true
              });
        }
    });
});
