var serialPort = require("serialport"),
    _ = require('underscore');

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
      console.log("%j", port);
    });
  }
};
