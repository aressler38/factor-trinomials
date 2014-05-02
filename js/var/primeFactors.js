// Find the prime factorization of a number n
// this algorithm returns an array of arrays,
// where the inner arrays [x,y] represent x^y
// combinations. 
// 
// Example:
// 
//  input  -> Math.primeFactors(18);
//  output -> [[2,1],[3,2]] == 2^1*3^2 == 18

define(function() {
    return function primeFactors(n) {
        if (n%1 !== 0 || n<2){throw new Error("primeFactors expected a natural number other than 1. throw: "+n);}

        var _primeFactors    = [];
        var upperBound      = Math.floor(n/2)+1;
        var testFactor      = 1;

        for (var i=2; i<upperBound; i++) {
            testFactor = multiplicity(i,n);
            // check if i is prime
            if (!isPrime(i)) continue;
            if (testFactor !== 0) {
                _primeFactors.push([i,testFactor]);
                if (isCompleteFactorization(_primeFactors, n)) {
                    return _primeFactors;
                }
            }
        }

        // didn't return primeFactors? then n is a prime.
        return [ [n,1] ];



        // ================================================================================
        // Section: Footer ... helper functions
        // ================================================================================


        /** 
         *
         * find the k such that a^k | b 
         * @returns k (the multiplicity of a into b);
         */ 
        function multiplicity(a, b) {
            var a_new = a;
            var k = 0;
            if (b%a !== 0) {
                return 0;
            }
            else {
                do {
                    a_new *= a;
                    k++;
                } while ((b % a_new === 0));
                if (a_new === b) {
                    k++;
                }
                return k;
            }
        }
        
        /**
         * is the 2d array primesWithMult is the prime factorization of number
         */
        function isCompleteFactorization(primesWithMult, number) {
            var len = primesWithMult.length;
            var product = 1;
            for (var i=0; i<len; i++) {
                product *= Math.pow(primesWithMult[i][0], primesWithMult[i][1]);
            }
            if (product === number) {
                return true;
            }
            else {
                return false;
            }
        }
        
        function isPrime(k) {
            if (Number.isNaN(k) || !isFinite(k) || k%1 || k<2) return false; 
            if (k%2===0) return (k===2);
            if (k%3===0) return (k===3);
            var m=Math.sqrt(k);
            for (var i=5;i<=m;i+=6) {
                if (k%i===0)     return false;
                if (k%(i+2)===0) return false;
            }
            return true;
        }
    };
});
