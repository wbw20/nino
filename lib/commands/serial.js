// var SerialPort = require("serialport").SerialPort,
//     fs = require('fs'),
//     _ = require('underscore');

// var list = require('./list');

// var defaults = {
//   baudrate: 115200
// };

module.exports = {
  execute: function(cb) {
  //   list.first(function(port) {
  //     var serial = new SerialPort(port.comName, defaults);
  //     serial.on('error', function(error) {
  //       cb(error);
  //     });
  //     serial.on('data', function(data) {
  //       cb(undefined, data);
  //     });

  //     serial.open(function(error) {
  //       if (error) { cb(error); }
  //     });
  //   });
    cb('This is unimplemented.')
  }
};
