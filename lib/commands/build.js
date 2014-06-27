var _ = require('underscore'),
    fs = require('fs'),
    async = require('async'),
    exec = require('child_process').exec;

var environment = require('../util/environment');

var libraries = ['arduino/pins/standard/', 'arduino/'];

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
 * Compile a c file
 */
function compile(input, output, cb) {
  linkingOptions(function(libraryPaths) {
    exec(environment.native() + 'avr/bin/avr-gcc -c -Os -ffunction-sections -fdata-sections -mmcu=atmega328p -DF_CPU=16000000UL -MMD ' + libraryPaths + ' ' + input + ' -o ' + output, cb);
  });
}

module.exports = {
  execute: function(options) {
    async.series([
      function(cb) {
        compile('src/main.c', 'bin/main.out', function(error, stdout, stderr) {
          cb(error, 'Building');
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
