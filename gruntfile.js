"use strict";

module.exports = function(grunt){

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // define the files to lint
      files: [
        'bin/www', 
        'app.js', 
        'config.js', 
        'gruntfile.js', 
        'helpers/*.js', 
        'libs/*.js',
        'models/*.js', 
        'controllers/*.js', 
        'routes/*.js', 
        'routes/api/*.js'
      ],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        // more options here if you want to override JSHint defaults
        globalstrict: true,
        esnext: 1,
        globals: {
          global: true,
          helper: true,
          __dirname: true,
          process: true,
          jQuery: true,
          console: true,
          module: true,
          setTimeout: true,
          logger: true,
          require: true,
          Buffer: true,
          document: true,
          _: true,
          config: true,
          rootRequire: true
        }
      }
    },
    apidoc: {
      myapp: {
        src: "routes/api",
        dest: "routes/documentation",
        template: "templates/documentation",
        options: {
          includeFilters: [".*\\.js$"],
          excludeFilters: ["node_modules/"]
        }
      }
    }
  });

  // Load the grunt plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-apidoc');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'apidoc']);

};