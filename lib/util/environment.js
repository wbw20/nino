module.exports = {
  native: function() {
    switch (process.platform) {
      case 'darwin':
        return require.resolve('../nino').replace('lib/nino.js', '') + 'native/osx/x64/'; //yes, a hack
    }
  }
};
