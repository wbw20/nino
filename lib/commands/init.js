var fs = require('fs'),
    environment = require('environment');

module.exports = {
  execute: function(path) {
    fs.mkdirSync('bin');
    fs.mkdirSync('src');
  }
};
