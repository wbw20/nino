var _ = require('underscore'),
    fs = require('fs'),
    async = require('async'),
    exec = require('child_process').exec;

var environment = require('../util/environment'),
    format = require('../util/format');

var libraries = ['arduino/pins/standard/', 'arduino/'],
    sArgs = {
      '-c': '',
      '-g': '',
      '-x': 'assembler-with-cpp'
    },
    cArgs = {
      '-c': '',
      '-g': '',
      '-Os': '',
      '-MMD': '',
      '-ffunction-sections': '',
      '-fdata-sections': ''
    },
    cppArgs = {
      '-c': '',
      '-g': '',
      '-Os': '',
      '-MMD': '',
      '-ffunction-sections': '',
      '-fdata-sections': '',
      '-fno-exceptions': ''
    },
    common = ' -mmcu=atmega328p -DF_CPU=16000000UL ';

/*
 * Errors coming out of C land
 */
function fail(error) {
  console.log(error);
  process.exit(1);
}

/*
 * Build a list of compiler path include i.e. ' -I /some/path -I /some/other/path '
 */
function linkingOptions(cb) {
  cb(_.reduce(libraries, function(built, path) {
    return built + ' -I ' + environment.headers() + path + ' ';
  }, ''));
}

/*
 * Compile a C file
 */
function compile(input, output, args, cb) {
  linkingOptions(function(libraryPaths) {
    exec(format(environment.native() + 'avr/bin/avr-gcc ', args, common + libraryPaths + ' ' + input + ' -o ' + output), cb);
  });
}

/*
 * Recursively compile a folder tree of C files
 */
var _recursiceCompile = function(dir, cb) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return cb(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return cb(null, results);
      file = dir + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          _recursiceCompile(file + '/', function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

module.exports = {
  execute: function(options) {
    async.series([
      function(cb) {
        compile('src/main.c', 'bin/main.out', cArgs, function(error, stdout, stderr) {
          cb(error, 'Building source');
        });
      },
      function(cb) {
        // exec(environment.native() + 'avr/bin/avr-gcc -mmcu=atmega328p -B ' + environment.headers() + 'arduino/ bin/main.out -o bin/main', function(error, stdout, stderr) {
        //   cb(error, 'Linking');
        // });
      },
      function(cb) {
        // exec(environment.native() + 'avr/bin/avr-objcopy -O ihex -R .eeprom bin/main bin/main.hex', function(error, stdout, stderr) {
        //   cb(error, 'Converting to Hex');
        // });
      }
    ], function(error, results) {
      if (error) {
        fail(error);
      } else {
        console.log('Done.')
      }
    });
  }
};
