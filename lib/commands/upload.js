var environment = require('../util/environment'),
    exec = require('child_process').exec;

module.exports = {
  execute: function() {
    exec(environment.native() + 'avrdude -p ATMEGA328P', function(error, stdout, stderr) {
      if (error) {
        console.log(error);
        exit(1);
      }
    });
  }
};
