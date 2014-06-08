var fs = require('fs'),
    environment = require('../util/environment');

module.exports = {
  execute: function(path) {
    fs.mkdirSync('bin');
    fs.mkdirSync('src');
  }
};
