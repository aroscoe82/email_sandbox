module.exports = function(grunt) {

  var dataFiles = grunt.file.expand({ filter: 'isFile', cwd: 'data'}, ['*.json']);
  var dataFileChoices = dataFiles.map(function(f){
    return { name: f, checked: false };
  });

  var templateFiles = grunt.file.expand({ filter: 'isFile', cwd: 'src/templates'}, ['**/*.html']);
  var templateFileChoices = templateFiles.map(function(f){
    return { name: f, checked: false };
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      cssDir: 'css',
      sassDir: 'sass',
      srcDir: 'src',
      templates: '<%= project.srcDir %>/templates',
      snippets: '<%= project.srcDir %>/snippets',
      compiled: '<%= project.srcDir %>/compiled',
      rendered: '<%= project.srcDir %>/rendered',
      styled: '<%= project.srcDir %>/styled',
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
          src: ['**/*.html']
        }]
      }
    },

    inlinecss: {
      main: {
        options: {
          applyStyleTags: true,
          applyLinkTags: true
        },
        expand: true,
        cwd: '<%= project.compiled %>',
        dest:  '<%= project.styled %>',
        src: ['**/*.html']
      }
    },

    prompt: {
      target: {
        options: {
          questions: [
            {
              config: 'templateFile',
              type: 'list',
              message: 'Select Template:',
              default: 'testing.html',
              choices: templateFileChoices,
              validate:   function(value){
                // console.log('templateFile: ', value);
                if(value == ''){
                  return 'Should not be blank';
                }

                return true;
              }
            },
            {
              config: 'dataFile',
              type: 'list',
              message: 'Select Data File:',
              default: 'testing.json',
              choices: dataFileChoices,
              validate:   function(value){
                // console.log('dataFile: ', value);
                if(value == ''){
                  return 'Should not be blank';
                }

                return true;
              }
            }
          ],
          then: function(results){
            var temp = {
              expand: true,
              cwd: 'src/styled',
              src: [results.templateFile],
              dest: 'src/rendered'
            }

            var fl = 'data/' + results.dataFile;
            console.log('fl: ', fl);

            grunt.config.set('renderNunjucks.render.options.data', fl);
            grunt.config.set('renderNunjucks.render.files', [temp]);
          }
        }
      }
    },

    renderNunjucks: {
      render: {
        options: {
          data: '<%= dataFile %>'
        },
        files: []
      }
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
        files: [{
          expand: true,
          cwd: '<%= project.styled %>',
          src: ['**/*.html'],
          dest: '<%= project.emails %>'
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
      },

      inlinecss: {
        files: '<%= project.compiled %>/*.html',
        tasks: ['inlinecss:main']
      }
    }
  });

  // Load plugins
  // grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-inline-css');
  grunt.loadNpmTasks('grunt-inky');
  grunt.loadNpmTasks('grunt-jinja');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-prompt');
  grunt.loadNpmTasks('grunt-render-nunjucks');

  grunt.registerTask('default', ['watch']);

  /* compile sass, compile partials, inline style */
  grunt.registerTask('build:dev', ['sass', 'jinja:pre', 'inlinecss:main']);

  grunt.registerTask('render', ['prompt', 'renderNunjucks'])

  /* compile sass, compile partials, inline styles copy to emails directory */
  grunt.registerTask('build:prod', ['sass', 'jinja:pre', 'inlinecss:main', 'copy'])
};