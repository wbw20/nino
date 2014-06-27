var environment = require('../util/environment'),
    async = require('async'),
    exec = require('child_process').exec;

/*
 * Errors coming out of C land
 */
function fail(error) {
  console.log(error);
  process.exit(1);
}

module.exports = {
  execute: function(options) {
    async.series([
      function(cb) {
        exec(environment.native() + 'avr/bin/avr-gcc -c -Os -ffunction-sections -fdata-sections -mmcu=atmega328p -DF_CPU=16000000UL -MMD -I ' + environment.headers() + 'arduino/ src/main.c -o bin/main.out', function(error, stdout, stderr) {
          cb(error, 'Building');
        });
      },
      function(cb) {
        // exec(environment.native() + 'avr/bin/avr-gcc -mmcu=atmega328p -B ' + environment.headers() + 'arduino/ bin/main.out -o bin/main', function(error, stdout, stderr) {
        //   cb(error, 'Linking');
        // });
      },
      function(cb) {
        // exec(environment.native() + 'avr/bin/avr-objcopy -O ihex -R .eeprom bin/main bin/main.hex', function(error, stdout, stderr) {
        //   cb(error, 'Converting to Hex');
        // });
      }
    ], function(error, results) {
      if (error) {
        fail(error);
      } else {
        console.log('Done.')
      }
    });
  }
};
