module.exports = function(grunt) {

    grunt.initConfig({
        
        pkg : grunt.file.readJSON("package.json"),
        
        jshint : {
            all : ["Gruntfile.js", "js/"],
            jshintrc: ".jshintrc",
        },
        

        uglify: {
            // uglify the "main.js" file
            main: { 
                files: {
                    "dist/main.min.js": [ "dist/main.js" ]
                },
                options: {
                    preserveComments: false,
                    sourceMap: "dist/main.js",
                    sourceMappingURL: "main.min.map",
                    report: "min",
                    beautify: {
                        ascii_only: true
                    },
                    compress: {
                        hoist_funs: false,
                        loops: false,
                        unused: false
                    }
                }
            }
        },

        build: {
            all: {
                dest: "dist/main.js",
                minimum: [
                    "main",
                ]
            }
        },
        
    });

    // Integrate specific tasks
    require( "load-grunt-tasks" )( grunt );
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.loadTasks( "build/tasks" );

    grunt.registerTask("dist", ["jshint", "build:*:*", "uglify:main"]);
    grunt.registerTask("default", ["dist"]);
}; 
