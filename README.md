factor-trinomials
=================

Use a generic rectangle and a diamond to factor a trinomial.


About
-----
    * This is a program that will display a diamond that is to be used
      with a generic rectangle for factoring quadratic expressions (ax^2 + bx +c).
    * Initialize the trinomial by calling Messenger.send("ft-initialize", a,b,c), where a, b, c are the 
      leading coefficients of the trinimial.  

Development Notes
-----------------

When checking out the repo for the 1st time run:
```
    git submodule init;
    git submodule update --recursive;    
    npm install
```
To build the project run:
```
    grunt
```



TODO
----
* No html template is allowed to have an instance of "\'" (no double quotes) in its content. This is an issue in the build process for templates.
    
