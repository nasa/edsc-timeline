module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    coffee: {
      compile: {
        options: {
          bare: true
        },
        expand: true,
        cwd: 'src/js',
        src: ['**/*.coffee'],
        dest: 'tmp/js',
        ext: '.js'
      }
    },
    browserify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': ['tmp/js/timeline.js']
        }
      }
    },
    less: {
      dist: {
        options: {
          compress: true,
          sourceMap: true
        },
        files: { 'dist/<%= pkg.name %>.css': 'src/css/timeline.less' }
      }
    },
    copy: {
      fonts: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['vendor/fonts/**/*', 'src/fonts/**/*'],
            dest: 'dist/fonts',
            filter: 'isFile'
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            cwd: 'src/js',
            src: ['**/*.js'],
            dest: 'tmp/js'
          }
        ]
      }
    },
    clean: {
      build: ['tmp'],
      release: ['dist']
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*'],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('default', ['coffee', 'copy:js', 'browserify', 'less']);
};
