var _ = require('underscore'),
    async = require('async'),
    exec = require('child_process').exec;

var environment = require('../util/environment'),
    format = require('../util/format'),
    list = require('./list');

var boardOptions = require('../util/boards').get('0x2341', '0x003e');

module.exports = {
  execute: function(options, cb) {
    list.first(function(port) {
      if (!port) { console.log('No boards found.'); return; }
      var params = _.extend({}, boardOptions.options.erase, {
        '-P ': port.comName
      }, options);
      exec(format(environment.native() + 'avr/bin/avrdude -F -V -e ', params, '-U flash:w:' + environment.empty()), cb);
    });
  }
};
