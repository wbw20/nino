var fs = require('fs');

module.exports = {
  execute: function(path) {
    fs.mkdirSync('bin');
  }
};
