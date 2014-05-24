module.exports = function(grunt) {
    
    var exec = require("child_process").exec;
    var pwd = process.cwd();

    function writeVersion() {
        exec("./build/tasks/setVersion.sh " + pwd, function(error, stdout, stderr) {
            if (error !== null) {
                console.log(stderr);
            }
            console.log(stdout);
        });

    }

    grunt.registerTask("writeVersion", writeVersion);

};
