factor-trinomials
=================

Use a generic rectangle and diamond to a factor trinomial
    Copyright (c) 2013. All Rights Reserved. 
        By Alexander Ressler.

About
******
        
    Currently, this is a program that will display a diamond that is to be used
    with a generic rectangle for factoring quadratic expressions (ax^2 + bx +c).
        
        
    The diamond.js file handles everything that has to do with the diamond.

    Custom events are propogated via a Messenger object. -- IN PROGRESS --  

    The initialize method (Diamond.initialize()) can customize the trinomial.
    coefficients. 
       example: Diamond.initialize([1,2,1]); // produces (x^2 + 2x + 1)

    The diamond is rendered in SVG managed by the JavaScript. 
    

TODO
*****

    * Use the Messenger to fire events when a user enters data. 

    * I want a rectangle.js file that is an object to handle the 'generic rectangle'.
    
    * Perhaps the initialize function in the Diamond object should be seperated???
      comments: but the current implementation is that the diamond and rectangle
                are seperate files and seperate object, which only makes sense.
 
