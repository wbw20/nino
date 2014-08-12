var serialPort = require("serialport"),
    fs = require('fs'),
    _ = require('underscore');

var environment = require('../util/environment');

var boards = {
  uno: '0x0043'
};

var defaultCb = function(boards) {
  boards.forEach(function(board) {
    console.log(board);
  });
};

module.exports = {
  list: function(cb) {
    if (!cb) { cb = defaultCb; }
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
  }
};
