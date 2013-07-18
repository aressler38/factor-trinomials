#############################################################################
#                                                                           # 
#    Build Script For Project factor-trinomials                             # 
#                                                                           #
#    About: this will construct a single html file by concatenating all     #
#           project scripts. The order of concatination is important        #
#                                                                           #
#############################################################################

#############################################################################
# FILE PATH SETUP
#############################################################################
# ... maybe use an .ini file if this gets outta control

# JavaScript
diamond_js="../diamond.js"
messenger_js="../messenger.js"
messenger_central_js="../ft-messenger-central.js"
rectangle_js="../rectangle.js"

# CSS
ft_style_css="../ft-style.css"

# Output File
output="../factortrinomials.html"

#############################################################################
# construct the output file as a single html file
#############################################################################

echo ""
echo "writing to the output file: $output"
echo ""

# clear the output file
echo " " | cat > $output


# HEAD BUILDER
echo "<!doctype html5>" | cat >> $output
echo "<html>" | cat >> $output
echo "<head>" | cat >> $output

echo "<meta charset='UTF-8'>" | cat >> $output
echo "<script type='text/javascript' src='http://code.jquery.com/jquery-1.9.1.min.js'></script>" | cat >> $output

echo "<script type='text/javascript'>" | cat >> $output
cat $messenger_js >> $output
echo "</script>" | cat >> $output

echo "<script type='text/javascript'>" | cat >> $output
cat $diamond_js >> $output
echo "</script>" | cat >> $output

echo "<script type='text/javascript'>" | cat >> $output
cat $rectangle_js >> $output
echo "</script>" | cat >> $output

echo "<script type='text/javascript'>" | cat >> $output;
cat $messenger_central_js >> $output
echo "</script>" | cat >> $output

echo "<style>" | cat >> $output
cat $ft_style_css >> $output
echo "</style>" | cat >> $output
echo "</head>" | cat >> $output

# BODY BUILDER
echo "<body>" | cat >> $output

echo '<div class="ft-container">' | cat >> $output
echo '    <div class="ft-trinomial">
        Trinomial container
    </div>

    <div id="ft-rectangle"></div>

    <div class="ft-diamond">
        <svg xmlns="http://www.w3.org/2000/svg" 
             style="width:200px; height:200px;"     
             version="1.1" class="ft-svg-container" 
             viewBox="0 0 200 200">
        </svg>
    </div>' | cat >> $output;

echo "</div>" | cat >> $output;


echo '<script type="text/javascript">
        Diamond.initialize();
        Rectangle();
        </script>' | cat >> $output;






echo "</body>" | cat >> $output
echo "</html>" | cat >> $output

