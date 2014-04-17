define(function() {
    return function ifOneOrNegOne(x, showOne) {
        if (x === 1) {
            if (showOne) return "+ 1";
            else return "+ ";
        }
        if (x === -1) {
            if (showOne) return "- 1";
            else return "- ";
        }
        // otherwise return 
        return x;
    }
});
