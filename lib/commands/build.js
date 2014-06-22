var environment = require('../util/environment'),
    exec = require('child_process').exec;

module.exports = {
  execute: function(options) {
    exec(environment.native() + 'avr/bin/avr-gcc -Os -DF_CPU=16000000UL -mmcu=atmega328p -o bin/main.out src/main.c', function(error, stdout, stderr) {
      if (error) {
        console.log(error);
        process.exit(1); // failure
      }
    });
  }
};
