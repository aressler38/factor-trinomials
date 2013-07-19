// Find the prime factorization of a number n
// this algorithm returns an array of arrays,
// where the inner arrays [x,y] represent x^y
// combinations. This module will append the 
// function to the Math object... should've 
// been there in the first place.
// 
// Example:
// 
//  input  -> Math.primeFactors(18);
//  output -> [[2,1],[3,2]] == 2^1*3^2 == 18

// originally by Alexander Ressler (c) 2013


Math.primeFactors = primeFactors;

function primeFactors(n) {
    if (n%1 != 0 || n<2){throw new Error("primeFactors expected a natural number other than 1.");}

    var primeFactors    = [];
    var upperBound      = Math.floor(n/2)+1;
    var testFactor      = 1;


    for (var i=2; i<upperBound; i++) {
        // check if i is prime
        if (!isPrime(i)) continue;

        testFactor = multiplicity(i,n);

        if (testFactor != 0) {
            primeFactors.push([i,testFactor]);
            if (isCompleteFactorization(primeFactors, n)) {
                return primeFactors;
            }
        }
    }

    // didn't return primeFactors? then n is a prime.
    return [ [n,1] ];



    // ================================================================================
    // Section: Footer ... helper functions
    // ================================================================================


    function multiplicity(a, b) {
        // find the k such that a^k | b 
        // return k;
        var a_new = a;
        var k = 0;
        if (b%a != 0) {
            return 0;
        }
        else {
            do {
                a_new *= a;
                k++;
            } while ((b % a_new == 0));
            if (a_new == b) {
                k++;
            }
            return k;
        }
    };
    
    function isCompleteFactorization(primesWithMult, number) {
        // check is the 2d array primesWithMult is the prime factorization of number
        var len = primesWithMult.length;
        var product = 1;
        for (var i=0; i<len; i++) {
            product *= Math.pow(primesWithMult[i][0], primesWithMult[i][1]);
        }
        if (product == number) {
            return true;
        }
        else {
            return false;
        }
    };
    
    function isPrime(k) {
        if (isNaN(k) || !isFinite(k) || k%1 || k<2) return false; 
        if (k%2==0) return (k==2);
        if (k%3==0) return (k==3);
        var m=Math.sqrt(k);
        for (var i=5;i<=m;i+=6) {
            if (k%i==0)     return false;
            if (k%(i+2)==0) return false;
        }
        return true;
    };
};
