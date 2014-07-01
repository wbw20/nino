var _ = require('underscore'),
    fs = require('fs'),
    async = require('async'),
    exec = require('child_process').exec;

var environment = require('../util/environment'),
    format = require('../util/format');

var sArgs = {
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
function linkingOptions(libraries, cb) {
  cb(_.reduce(libraries, function(built, path) {
    return built + ' -I ' + environment.headers() + path + ' ';
  }, ''));
}

/*
 * Compile a C file
 */
function compile(file, libraries, cb) {
  switch (file.split('.').pop()) {
    case 'S':
      _compile(file, libraries, sArgs, cb); break;
    case 'c':
      _compile(file, libraries, cArgs, cb); break;
    case 'cpp':
      _compile(file, libraries, cppArgs, cb); break;
    case 'h':
      cb('Skipping ' + file);
      break;
    default:
      cb('I can\'t figure out what kind of file ' + file.split('.').pop() + ' is. Skipping.');
      break;
  }
}

function _compile(file, libraries, args, cb) {
  linkingOptions(libraries, function(libraryPaths) {
    exec(format(environment.native() + 'avr/bin/avr-gcc ', args, common + libraryPaths + ' ' + file + ' -o ' + 'bin/' + file.split('/').pop().split('.')[0] + '.out'), function(error, stdout, stderr) {
      if (error) { cb(error); return; }
      cb('Finished compiling ' + file);
    });
  });
}

/*
 * Compile all C files in a folder tree
 */
function recursiveCompile(folder, libraries, cb) {
  _files(folder, function(error, files) {
    async.queue(function(file, callback) {
      compile(file, libraries, callback);
    }, 3).push(files, cb);
  });
}

/*
 * Get all of the files in a folder tree
 */
var _files = function(folder, cb) {
  var results = [];
  fs.readdir(folder, function(err, list) {
    if (err) return cb(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return cb(null, results);
      file = folder + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          _files(file + '/', function(err, res) {
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
        recursiveCompile('src/', ['arduino/pins/standard/', 'arduino/'], function(error, stdout, stderr) {
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
