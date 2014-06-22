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
      _.where(ports, {
        manufacturer: 'Arduino (www.arduino.cc)'
      }).forEach(function(port) {
        cb(port);
      });
    });
  },
  first: function(cb) {
    serialPort.list(function (err, ports) {
      cb(_.where(ports, {
        manufacturer: 'Arduino (www.arduino.cc)'
      })[0]);
    });
  },
  execute: function() {
    this.list(function(port) {
      if (port.productId === boards.uno) {
        console.log(fs.readFileSync(environment.install() + 'lib/ascii/uno.txt', 'utf8'));
      }

      console.log("%j", port);
    });
  }
};
