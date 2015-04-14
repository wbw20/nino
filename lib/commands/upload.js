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

module.exports = {
  execute: function(options, cb) {
    list.first(function(port) {
      if (!port) { console.log('No boards found.'); return; }
      var params = _.extend({}, defaults, {
        '-P': port.comName
      }, options);
      exec(format(environment.native() + 'avr/bin/avrdude', params, ' -D -U flash:w:bin/main.hex:i'), cb);
    });
  }
};
