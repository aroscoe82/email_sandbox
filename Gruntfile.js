module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      cssDir: 'css',
      sassDir: 'sass'
    },

    sass: {
      dist: {
        options: {
          style: 'compact',
          lineNumbers: false,
          compass: false,
          sourcemap: 'none',
          loadPath: ['vendor/foundation-emails/scss']
        },
        files: [{
          expand: true,
          cwd: '<%= project.sassDir %>',
          src: ['*.scss'],
          dest: '<%= project.cssDir %>',
          ext: '.css'
        }]
      }
    },

    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },

      sass: {
        files: '<%= project.sassDir %>/*.scss',
        tasks: ['sass:dist']
      }
    }
  });

  // Load plugins
  // grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
};