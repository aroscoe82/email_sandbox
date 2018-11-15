module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      cssDir: 'css',
      sassDir: 'sass',
      templatesDir: 'raw_templates',
      templates: '<%= project.templatesDir %>/templates',
      snippets: '<%= project.templatesDir %>/email_snippets',
      compiled: '<%= project.templatesDir %>/compiled_templates',
      rendered: '<%= project.templatesDir %>/rendered_templates',
      styled: '<%= project.templatesDir %>/styled_templates',
      emails: 'templates/',
      dataDir: 'data',
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

    jinja: {
      pre: {
        options: {
          templateDirs: ['<%= project.templates %>'],
          tags: {
            blockStart: '<%',
            blockEnd: '%>',
            variableStart: '<$',
            variableEnd: '$>',
            commentStart: '<#',
            commentEnd: '#>'
          }
        },
        files: [{
          expand: true,
          cwd: '<%= project.templates %>',
          dest: '<%= project.compiled %>',
          src: ['*.html']
        }]
      }
    },

    inlinecss: {
      main: {
        options: {},
        expand: true,
        cwd: '<%= project.compiled %>',
        dest:  '<%= project.styled %>',
        src: ['*.html']
      }
    },

    mustache_render: {
      main: {
        files : [{
            data: '<%= project.dataDir %>/testing.json',
            template: '<%= project.styled %>/testing.html',
            dest: '<%= project.rendered %>/testing_render.html' 
          },{
            data: '<%= project.dataDir %>/testing.json',
            template: '<%= project.styled %>/boilerplate.html',
            dest: '<%= project.rendered %>/boilerplate_render.html' 
          },{
            data: '<%= project.dataDir %>/newDiscussion.json',
            template: '<%= project.styled %>/newDiscussion.html',
            dest: '<%= project.rendered %>/newDiscussion_render.html' 
          }]
      },
    },

    // inky: {
    //     base: {
    //         options: {
    //             // your options for Inky 
    //         },
    //         files: [
    //             {
    //                 cwd: '<%= project.emailTemplateDir %>/',
    //                 src: '*.html',
    //                 dest: '<%= project.emailDir %>/',
    //                 filter: 'isFile',
    //                 expand: true
    //             }
    //         ]
    //     }
    // },

    copy: {
      main: {
        files: {
          expand: true,
          cwd: '<%= project.styled %>',
          src: ['*.html'],
          dest: '<%= project.emails %>'
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
        files: '<%= project.compiled %>/*.html',
        tasks: ['inlinecss:main']
      },

      // mustache: {
      //   files: '<%= project.emailDir %>/*.html',
      //   tasks: ['mustache_render:main']
      // }
    }
  });

  // Load plugins
  // grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-inline-css');
  grunt.loadNpmTasks('grunt-mustache-render');
  grunt.loadNpmTasks('grunt-inky');
  grunt.loadNpmTasks('grunt-jinja');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['watch']);

  /* compile sass, compile partials, inline style, merge with data */
  grunt.registerTask('build:dev', ['sass', 'jinja:pre', 'inlinecss:main', 'mustache_render']);

  /* compile sass, compile partials, inline styles copy to emails directory */
  grunt.registerTask('build:prod', ['sass', 'jinja:pre', 'inlinecss', 'copy'])
};