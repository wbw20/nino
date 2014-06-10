var serialPort = require("serialport");

module.exports = {
  execute: function() {
    serialPort.list(function (err, ports) {
      ports.forEach(function(port) {
        if (port.manufacturer.indexOf('Arduino') != -1) {
          console.log("%j", port);
        }
      });
    });
  }
};
