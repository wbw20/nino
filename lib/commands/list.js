var serialPort = require("serialport");

module.exports = {
  execute: function() {
    serialPort.list(function (err, ports) {
      ports.forEach(function(port) {
        console.log(port.comName);
        console.log(port.pnpId);
        console.log(port.manufacturer);
      });
    });
  }
};
