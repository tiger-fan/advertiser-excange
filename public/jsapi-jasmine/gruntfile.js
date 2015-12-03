module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    jshint: {
      files: [ 'gruntfile.js','./spec/javascripts/*.spec.js'],
      options: {
        //"undef": true,
        'loopfunc': true,
        'smarttabs': true,
        'eqnull': true,
        'sub': true,
        'asi':true,
        globals: {
          '_': true,
          'console': true,
          'esri': true,
          'dojo': true,
          'window': true,
          'setTimeout': true,
          'clearTimeout': true,
          'document': true,
          'localStorage': true,
          'location': true,
          'FileReader': true,
          'describe':true,
          'it': true,
          'afterEach': true,
          'beforeEach': true,
          'expect': true
        }
      }
      
    },

    watch: {
      scripts: {
        files: ['gruntfile.js', './spec/javascripts/*.spec.js', './src/extras/ClusterLayer.js', '.src/arcgis.js'],
        tasks: ['jshint', 'jasmine'],
        options: {
          nospawn: true
        }
      }
    },

    jasmine: {
      myApp: {
        src: ['./src/extras/ClusterLayer.js', './src/arcgis.js', '../assets/store/arcgis.js'],
        //unclear why this helper is not loading this way...
        //added below under vendor and it works
        helpers: ['./spec/javascripts/helpers/SpecHelper.js', '.spec/javascripts/helpers/maphelper.js'],
        options: {
          template:'./spec/MapRunner.tmpl',
          vendor:[
            './lib/jquery-1.10.2.min.js',
            './lib/jasmine-jquery.js',
            './spec/javascripts/helpers/maphelper.js',
            './spec/javascripts/helpers/SpecHelper.js'
          ],
          keepRunner: true,
          specs: [
            './spec/javascripts/*.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', [ 'jshint', 'jasmine' ]);

};
