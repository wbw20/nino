var serialPort = require("serialport");

module.exports = {
  list: function(cb) {
    serialPort.list(function (err, ports) {
      ports.forEach(function(port) {
        if (port.manufacturer.indexOf('Arduino') != -1) {
          cb(port);
        }
      });
    });
  },
  execute: function() {
    this.list(function(port) {
      console.log("%j", port);
    });
  }
};
