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
                    "dist/js/main.min.js": [ "dist/js/main.js" ]
                },
                options: {
                    preserveComments: false,
                    sourceMap: "dist/js/main.js",
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

        copy: {
            css2android: {
                src: "dist/css/main.css",
                dest: "factor-trinomials/www/css/main.css"
            },
            fontdir: {
                expand: true,
                cwd: "dist/css/icons",
                src: "**",
                dest: "factor-trinomials/www/css/icons"
            },
            htmlIndex: {
                src: "dist.html",
                dest: "dist/index.html"
            }

        },

        /* Configured in build task file */
        build: { all: { } },
        writeVersion: { all: {} }
        
    });

    // Integrate specific tasks
    require( "load-grunt-tasks" )( grunt );
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-requirejs");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.loadTasks( "build/tasks" );

    grunt.registerTask("dist", ["jshint", "writeVersion:all", "build:all", "uglify:main", "copy:css2android", "copy:fontdir", "copy:htmlIndex"]);
    grunt.registerTask("default", ["dist"]);
}; 
