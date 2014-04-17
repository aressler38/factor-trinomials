define(function() {
    // return a random integer in [min, max]
    return function randomInt(min,max, withZero) {
        if (withZero) {
            var rand = Math.random();
            var randInt = Math.round(min + rand*(max-min));
            return randInt;
        }
        else {
            var rand = Math.random();
            var randInt = Math.round(min + rand*(max-min));
            while (randInt == 0) {
                rand = Math.random();
                randInt = Math.round(min + rand*(max-min));
            }
            return randInt;
        }
    };
});
