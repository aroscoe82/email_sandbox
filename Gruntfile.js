module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      cssDir: 'css',
      sassDir: 'sass',
      emailTemplateDir: 'email_templates',
      emailDir: 'emails',
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

    inlinecss: {
        main: {
            options: {
            },
            files: {
                'emails/testing.html': 'email_templates/testing.html'
            }
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
      },

      inlinecss: {
        files: '<%= project.emailTemplateDir %>/*.html',
        tasks: ['inlinecss:main']
      }
    }
  });

  // Load plugins
  // grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-inline-css');

  grunt.registerTask('default', ['watch']);
};