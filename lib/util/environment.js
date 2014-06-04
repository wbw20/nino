var fs = require('fs');

module.exports = {
  project: function() {
    return process.cwd() + '/';
  },
  install: function() {
    return __dirname.replace('lib/util', '');
  },
  native: function() {
    switch (process.platform) {
      case 'darwin':
        return this.install() + 'native/osx/x64/'; //yes, a hack
    }
  },
  avrconf: function() {
    switch (process.platform) {
      case 'darwin':
        if (fs.existsSync('/usr/local/etc/avrdude.conf')) {
          return '/usr/local/etc/avrdude.conf';
        } else {
          return this.native() + 'avrdude.conf';
        }
    }
  }
};
