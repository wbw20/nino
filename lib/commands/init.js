var fs = require('fs');

var environment = require('../util/environment');

module.exports = {
  execute: function(path) {
    fs.mkdirSync('bin');
    fs.mkdirSync('src');
  }
};
