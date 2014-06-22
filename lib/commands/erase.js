var _ = require('underscore'),
    async = require('async'),
    exec = require('child_process').exec;

var environment = require('../util/environment'),
    format = require('../util/format'),
    list = require('./list');

var defaults = {
  '-c': 'arduino',
  '-p': 'ATMEGA328P',
  '-b': '115200',
  '-C': environment.avrconf()
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
        '-P ': port.comName
      }, options);
      exec(format(environment.native() + 'avr/bin/avrdude -F -V -e ', params, '-U flash:w:' + environment.empty()), function(error, stdout, stderr) {
        if (error) {
          fail(error);
        } else {
          console.log('Done.')
        }
      });
    });
  }
};
