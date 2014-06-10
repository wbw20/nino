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

module.exports = {
  execute: function(options) {
    list.first(function(port) {
      var params = _.extend({}, defaults, {
      }, options);
      exec(formatter.build(environment.native() + 'avr/bin/avrdude', params),
      function(error, stdout, stderr) {
        if (error) {
          console.log(error);
          process.exit(1); // failure
        }
      });
    });
  }
};
