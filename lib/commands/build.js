var environment = require('../util/environment'),
    exec = require('child_process').exec;

module.exports = {
  execute: function(options) {
    exec(environment.native() + 'avr/bin/avr-gcc src/main.c', function(error, stdout, stderr) {
      if (error) {
        console.log(error);
        process.exit(1); // failure
      }
    });
  }
};
