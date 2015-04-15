var _ = require('underscore'),
    fs = require('fs'),
    async = require('async'),
    exec = require('child_process').exec;

var environment = require('../util/environment'),
    format = require('../util/format'),
    boardOptions = require('../util/boards').get('0x2341', '0x003e');

var common = ' -MMD -DUSB_VID=null -DUSB_PID=null -DARDUINO=105 -mmcu=atmega328p -DF_CPU=16000000L ';

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
    //TODO:  does this work *with* a space?
    return built + ' -I' + environment.headers() + path + ' ';
  }, ''));
}

/*
 * Compile a C file
 */
function compile(file, output, libraries, cb) {
  switch (file.split('.').pop()) {
    case 'S':
      _compile('avr-gcc', file, output, libraries, boardOptions.options.sArgs, cb); break;
    case 'c':
      _compile('avr-gcc', file, output, libraries, boardOptions.options.cArgs, cb); break;
    case 'cpp':
      _compile('avr-g++', file, output, libraries, boardOptions.options.cppArgs, cb); break;
    case 'h':
      cb('Skipping ' + file);
      break;
    default:
      cb('I can\'t figure out what kind of file ' + file.split('.').pop() + ' is. Skipping.');
      break;
  }
}

function _compile(compiler, file, output, libraries, args, cb) {
  linkingOptions(libraries, function(libraryPaths) {
    exec(format(environment.native() + 'avr/bin/' + compiler + ' ', args, common + libraryPaths + ' ' + file + ' -o ' + output + file.split('/').pop().split('.')[0] + '.out'), function(error, stdout, stderr) {
      if (error) { cb(error); return; }
      cb('Finished compiling ' + file);
    });
  });
}

/*
 * Use avr-gcc to link binaries
 */
function link(output, file, archive, library, done) {
  exec(format(environment.native() + 'avr/bin/avr-gcc ', boardOptions.options.linking, ' -o ' + output + ' ' + file + ' ' + archive + ' -L ' + library + ' -lm'), function(error, stdout, stderr) {
    if (error) { console.log(error); return; }
    console.log('Finished linking ' + output);
    done();
  });
}

/*
 * Copy a file, possibly transforming it in the process
 */
function objcopy(input, output, options, done) {
  exec(format(environment.native() + 'avr/bin/avr-objcopy ', options, ' ' + input + ' ' + output), function(error, stdout, stderr) {
    if (error) { console.log(error); return; }
    console.log('Finished copying ' + output);
    done();
  });
}

/*
 * Archive compiled files using avr-ar
 */
function archive(folder, output, cb, done) {
  _filesOfType(folder, 'out', function(error, files) {
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
 * output:    the folder to but compiled files in
 * libraries: libraries to be included in the build path
 * cb:        callback to be called after each file is compiled
 * done:      callback to be called after all files finish compiling
 */
function recursiveCompile(folder, output, libraries, cb, done) {
  _files(folder, function(error, files) {
    var queue = async.queue(function(file, callback) {
      compile(file, output, libraries, callback);
    }, 3);

    queue.push(files, cb);
    queue.drain = done;
  });
}

/*
 * Get all of the files in a folder tree
 */
var _files = function(folder, cb) {
  if (fs.lstatSync(folder).isFile()) { return cb(null, folder); }

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

/*
 * Get files by folder and extension
 */
function _filesOfType(folder, type, cb) {
  _files(folder, function(error, files) {
    if (error) { return cb(error); }
    cb(null, _.filter(files, function(file) {
      return file.split('.').pop() === type;
    }));
  });
}

module.exports = {
  /*
   * Build steps:
   *
   *   1.  Compile all files in src/
   *   2.  Compile core
   *   3.  Archive core into an .a file
   *   4.  Link everything into an .elf file
   *   5.  Extract eeprom data into an .eep file
   *   6.  Finally build the .hex file
   */
  execute: function(options, cb) {
    var target = options._[1] || 'src/';

    async.series([
      function(callback) {
        /* todo: add src/ to build path for projects with more than one file */
        recursiveCompile(target, 'bin/', ['common/pins/standard/', 'arduino/'], function(output) {
          console.log(output)
        }, callback);
      },
      function(callback) {
        recursiveCompile(environment.install() + 'headers/arduino/', 'bin/arduino/', ['common/pins/standard/', 'arduino/'], function(output) {
          console.log(output);
        }, callback);
      },
      function(callback) {
        archive('bin/arduino/', 'bin/main.a', function(output) {
          console.log(output);
        }, callback);
      },
      function(callback) {
        link('bin/main.elf', 'bin/driver.out', 'bin/main.a', 'bin/arduino/', callback);
      },
      function(callback) {
        objcopy('bin/main.elf', 'bin/main.eep', boardOptions.options.transform, callback);
      },
      function(callback) {
        objcopy('bin/main.elf', 'bin/main.hex', boardOptions.options.copy, callback);
      }
    ], cb);
  }
};
