var _ = require('underscore');

module.exports = {
  build: function(command, options) {
    var formatted = command,
        keys = _.keys(options)

    for (i = 0; i < keys.length; i++) {
      formatted += ' ' + keys[i] + ' ' + options[keys[i]];
    }

    return formatted;
  }
};
