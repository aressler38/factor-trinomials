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

    The diamond is rendered in SVG managed by the JavaScript. 
    

TODO
*****

    I want a rectangle.js file that is an object to handle the 'generic rectangle'.
    
    Perhaps the initialize function in the Diamond object should be seperated???
    I feel like a diamond and generic rectangle work together, but they need a 
    common initialization, and they need a way to 'listen' to each other. 
      comments: but the current implementation is that the diamond and rectangle
                are seperate files and seperate object, which only makes sense.



            
 
