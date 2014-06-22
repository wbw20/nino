var _ = require('underscore');

var environment = require('../util/environment'),
    formatter = require('../util/formatter'),
    list = require('../commands/list'),
    exec = require('child_process').exec;

var defaults = {
  '-p': 'ATMEGA328P',
  '-c': 'stk500v1',
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
      }, options);
      exec(environment.native() + 'avr/bin/avrdude -F -V -c arduino -C ' + environment.native() + 'avr/etc/avrdude.conf -p ATMEGA328P -P /dev/cu.usbmodem1411 -b 115200 -U flash:w:bin/main.hex', function(error, stdout, stderr) {
        if (error) {
          fail(error);
        } else {
          console.log('Done.')
        }
      });
    });
  }
};
