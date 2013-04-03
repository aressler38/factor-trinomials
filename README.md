factor-trinomials
=================

Use a generic rectangle and diamond to a factor trinomial



        
    Currently, this is a program that will display a diamond that is to be used
    with a generic rectangle for factoring quadratic expressions (ax^2 + bx +c).
        
        
    The diamond.js file handles everything that has to do with the diamond.
    
    I want to implement a simple function that listens for custom events. Right,
    I could use backbone.js, but I don't need it. 
    I want a rectangle.js file that is an object to handle the 'generic rectangle'.
    
    Perhaps the initialize function in the Diamond object should be seperated???
    I feel like a diamond and generic rectangle work together, but they need a 
    common initialization, and they need a way to 'listen' to each other. 

    The initialize method (Diamond.initialize()) can customize the trinomial.
    THAT should be an object of its own!    

    The diamond is rendered in SVG managed by the JavaScript. 
            
    comments and TODOs throughout...
 
