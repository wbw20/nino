var fs = require('fs');

var environment = require('../util/environment');

function rmDir(original, dirPath) {
  if (!dirPath) {
    dirPath = original;
  }

  try { var files = fs.readdirSync(dirPath); }
  catch(e) { console.log(e); return; }
  if (files.length > 0) {
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      } else {
        rmDir(original, filePath);
      }
    }
  }

  if (dirPath != original) {
    fs.rmdirSync(dirPath);
  }
};

module.exports = {
  execute: function(path) {
    rmDir(environment.project() + 'bin');
  }
};
