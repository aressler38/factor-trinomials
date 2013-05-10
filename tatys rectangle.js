diff --git a/index.html b/index.html
index 766eecf..9af2f2c 100644
--- a/index.html
+++ b/index.html
@@ -13,8 +13,9 @@
     <script type="text/javascript"
             src="http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
     </script>
-    <script type="text/javascript" src="diamond.js"></script>
     <script type="text/javascript" src="messenger.js"></script>
+    <script type="text/javascript" src="diamond.js"></script>
+    <script type="text/javascript" src="rectangle.js"></script>
     <script type="text/javascript" src="ft-messenger-central.js"></script>
 
     
@@ -22,19 +23,14 @@
 </head>
 
 <body>
-    <div class="ft-container">
-    <!--
-        I'm not indenting the elements that are 1 level into ft-container;
-        I don't want to style the body tag. What if you want to
-        integrate this somewhere else? So, treat ".ft-container" like the body,
-        and style it instead.
-    -->
+<div class="ft-container">
     
     <div class="ft-trinomial">
         Trinomial container
     </div> 
-    <div style="clear:both;"></div>
     
+    <div id="ft-rectangle"></div>   
+
     <div class="ft-diamond">
         <svg xmlns="http://www.w3.org/2000/svg" 
              style="width:200px; height:200px;"     
@@ -43,15 +39,15 @@
         </svg>
     </div>
     
-    <div class="ft-rectangle"></div>   
+
     
-    </div>
+</div>
 
-    <!-- Finished with the initial layout. The following JavaScript would ideally be in a seperate file -->
     
-    <script type="text/javascript">
+<script type="text/javascript">
         Diamond.initialize();
-    </script>
+        Rectangle();
+</script>
     
     
 </body>
