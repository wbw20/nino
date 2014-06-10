var environment = require('../util/environment'),
    exec = require('child_process').exec;

module.exports = {
  execute: function(options) {
    exec(environment.native() + 'avr/bin/avrdude -p ATMEGA328P -c stk500v1 -C ' + environment.avrconf(), function(error, stdout, stderr) {
      if (error) {
        console.log(error);
        process.exit(1); // failure
      }
    });
  }
};
