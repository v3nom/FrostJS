module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            frost: {
                src: 'src/frost.ts',
                out: 'build/frost.js',
                options: {
                    declaration: true,
                    target: 'es5',
                    sourceMap: false
                }
            }
        },
        uglify: {
            frost: {
                files: {
                    'build/frost.min.js': ['build/frost.js']
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['ts:frost', 'uglify:frost']);

};