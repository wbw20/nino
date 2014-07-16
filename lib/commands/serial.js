var SerialPort = require("serialport").SerialPort,
    fs = require('fs'),
    _ = require('underscore');

var list = require('./list');

var baud = 9600;

module.exports = {
  execute: function() {
    list.first(function(port) {

      var serial = new SerialPort(port.comName, {
        baudrate: baud
      });

      serial.on('error', function(error) {
        console.log(error);
      });

      serial.on('data', function(data) {
        console.log('data: ' + data);
      });

      serial.open(function(error) {
        console.log(error);
        serial.write(new Buffer("hello"));
      });
    });
  }
};
