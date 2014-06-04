var fs = require('fs');

function base() {
  return require.resolve('../nino').replace('lib/nino.js', '');
}

module.exports = {
  native: function() {
    switch (process.platform) {
      case 'darwin':
        return base() + 'native/osx/x64/'; //yes, a hack
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
