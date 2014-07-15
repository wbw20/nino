var _ = require('underscore');

var environment = require('../util/environment'),
    format = require('../util/format'),
    list = require('../commands/list'),
    exec = require('child_process').exec;

var defaults = {
  '-C': environment.avrconf(),
  '-q': '-q',
  '-p': 'atmega328p',
  '-c': 'arduino',
  '-b': '115200'
};

/*
 * Errors coming out of C land
 */
function fail(error) {
  console.log(error);
  process.exit(1);
}

module.exports = {
  execute: function(options) {
    list.first(function(port) {
      var params = _.extend({}, defaults, {
        '-P': port.comName
      }, options);
      exec(format(environment.native() + 'avr/bin/avrdude', params, ' -D -U flash:w:bin/main.hex:i'), function(error, stdout, stderr) {
        if (error) {
          fail(error);
        } else {
          console.log('Done.')
        }
      });
    });
  }
};
