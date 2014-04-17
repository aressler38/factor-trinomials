define(function() {
    return function prettifySign(x) {
        var _x = null;
        if (typeof x === "string") {
            _x = x.replace(/ /g, ''); // remove whitespace
            _x = parseInt(_x);
            if (Number.isNaN(_x)){return x;};
        }
        else {
            _x = x;
        }
        if ((_x) >= 0) 
            return "+ "+ _x
        else return "- " + (-1*_x);
    }
});
