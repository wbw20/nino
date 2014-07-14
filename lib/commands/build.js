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
    linking = {
      '-Os': '',
      '-Wl,--gc-sections': ''
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
    exec(format(environment.native() + 'avr/bin/avr-gcc ', args, common + libraryPaths + ' ' + file + ' -o ' + 'bin/arduino/' + file.split('/').pop().split('.')[0] + '.out'), function(error, stdout, stderr) {
      if (error) { cb(error); return; }
      cb('Finished compiling ' + file);
    });
  });
}

/*
 * Use avr-gcc to link binaries
 */
function link(output, folder, cb, done) {
  _files(folder, function(error, files) {
    _link(output, files, cb);
  });
}

function _link(output, files, cb) {
  var paths = _.reduce(files, function(built, path) {
    return built + ' ' + path;
  }, '');

  exec(format(environment.native() + 'avr/bin/avr-gcc ', linking, common + ' ' + file + ' -o ' + output + ' ' + paths), function(error, stdout, stderr) {
    if (error) { cb(error); return; }
    cb('Finished linking ' + output);
  });

  // SOMEHOW CALL DONE
}

/*
 * Archive compiled files using avr-ar
 */
function archive(folder, output, cb, done) {
  _files(folder, function(error, files) {
    var queue = async.queue(function(file, callback) {
      _archive(file, output, callback);
    }, 3);

    queue.push(files, cb);
    queue.drain = done;
  });
}

function _archive(file, output, cb) {
  exec(environment.native() + 'avr/bin/avr-ar rcs ' + output + ' ' + file, function(error, stdout, stderr) {
    if (error) { cb(error); return; }
    cb('Finished archiving ' + file);
  });
}

/*
 * Compile all C files in a folder tree
 *
 * folder:    the folder to be compiled
 * libraries: libraries to be included in the build path
 * cb:        callback to be called after each file is compiled
 * done:      callback to be called after all files finish compiling
 */
function recursiveCompile(folder, libraries, cb, done) {
  _files(folder, function(error, files) {
    var queue = async.queue(function(file, callback) {
      compile(file, libraries, callback);
    }, 3);

    queue.push(files, cb);
    queue.drain = done;
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
  /*
   * Build steps:
   *
   *   1.  Compile all files in src/
   *   2.  Compile core
   *   3.  Archive core into a .a file
   *   4.  Link everything into a .elf file
   */
  execute: function(options) {
    async.series([
      function(cb) {
        /* todo: add src/ to build path for projects with more than one file */
        recursiveCompile('src/', ['arduino/pins/standard/', 'arduino/'], function(output) {
          console.log(output)
        }, cb);
      },
      function(cb) {
        recursiveCompile(environment.install() + 'headers/arduino/', ['arduino/pins/standard/', 'arduino/'], function(output) {
          console.log(output);
        }, cb);
      },
      function(cb) {
        archive('bin/arduino/', 'bin/main.a', function(output) {
          console.log(output);
        }, cb);
      },
      function(cb) {
        link('bin/main.elf', 'bin/arduino', function(output) {
          console.log(output);
        }, cb);
      },
      function(cb) {
        // exec(environment.native() + 'avr/bin/avr-objcopy -O ihex -R .eeprom bin/main bin/main.hex', function(error, stdout, stderr) {
        //   cb(error, 'Converting to Hex');
        // });
        cb();
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
