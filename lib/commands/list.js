var usb = require("usb"),
    fs = require('fs'),
    _ = require('underscore');

var environment = require('../util/environment');

var boards = {
  uno: '0x0043'
};

var defaultCb = function(boards) {
  if (boards.length === 0) { console.log('None.'); return; }
  boards.forEach(function(board) {
    console.log(board);
  });
};

module.exports = {
  list: function(cb) {
    if (!cb) { cb = defaultCb; }
    var ports = usb.getDeviceList();
    cb(_.filter(ports, function(port) {
      return port.deviceDescriptor.idVendor === 9025 || port.manufacturer === 'Arduino (www.arduino.cc)';
    }));
  },
  first: function(cb) {
    if (!cb) { cb = defaultCb; }
    var ports = usb.getDeviceList();
    cb(_.filter(ports, function(port) {
      return port.deviceDescriptor.idVendor === 9025 || port.manufacturer === 'Arduino (www.arduino.cc)';
    })[0]);
  }
};
