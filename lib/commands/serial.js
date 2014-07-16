var SerialPort = require("serialport").SerialPort,
    fs = require('fs'),
    _ = require('underscore');

var list = require('./list');

var defaults = {
  baudrate: 9600
};

/*
 * Errors coming out of C land
 */
function fail(error) {
  console.log(error);
  process.exit(1);
}

/*
 * Serial line data handler
 */
function data(input) {
  console.log(input.toString());
}

module.exports = {
  execute: function() {
    list.first(function(port) {
      var serial = new SerialPort(port.comName, defaults);
      serial.on('error', fail);
      serial.on('data', data);

      serial.open(function(error) {
        if (error) { fail(error); }
      });
    });
  }
};
