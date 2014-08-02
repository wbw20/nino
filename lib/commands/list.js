var serialPort = require("serialport"),
    fs = require('fs'),
    _ = require('underscore');

var environment = require('../util/environment');

var boards = {
  uno: '0x0043'
};

module.exports = {
  list: function(cb) {
    serialPort.list(function (err, ports) {
      cb(_.where(ports, {
        manufacturer: 'Arduino (www.arduino.cc)'
      }));
    });
  },
  first: function(cb) {
    serialPort.list(function (err, ports) {
      cb(_.where(ports, {
        manufacturer: 'Arduino (www.arduino.cc)'
      })[0]);
    });
  },
  execute: function(cb) {
    this.list(cb);
  }
};
