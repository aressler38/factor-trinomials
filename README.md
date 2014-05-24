factor-trinomials
=================

Use a generic rectangle and a diamond to factor a trinomial.


About
-----
    * This is a program that will display a diamond that is to be used
      with a generic rectangle for factoring quadratic expressions (ax^2 + bx +c).
    * Initialize the application by sending the *initialize* or *randomize* appMessenger events.  

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



Revision History
----------------

1.2.x
*****
* Added Hints module.
* Bugfixes.

1.1.x
*****
* Added the number pad module.
* Bugfixes.

1.0.0
*****
* Added grunt build processes.
* Converted entire project to AMD compliant code.
* Cleaned code to pass jshint.

0.x.x
*****
* Initial feature set.
* No Hints module.
* SVG used for Diamond.
* Not AMD compliant.




TODO
----
* No html template is allowed to have an instance of "\'" (no double quotes) in its content. This is an issue in the build process for templates.
