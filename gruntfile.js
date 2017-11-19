"use strict";

module.exports = function(grunt){

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
          configFile: '.eslintrc.json'
      },
      target: [
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
      ]
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
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-apidoc');

  // Default task(s).
  grunt.registerTask('default', ['eslint', 'apidoc']);

};