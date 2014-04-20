define(function() {
    return function randomInt(min,max, withZero) {
        var rand = Math.random();
        var randInt = Math.round(min + rand*(max-min));
        if (withZero) {
            return randInt;
        }
        else {
            while (randInt === 0) {
                rand = Math.random();
                randInt = Math.round(min + rand*(max-min));
            }
            return randInt;
        }
    };
});
