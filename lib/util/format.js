var _ = require('underscore');

module.exports = function(command, options, target) {
  var formatted = command,
      keys = _.keys(options)

  for (i = 1; i < keys.length; i++) {
    formatted += ' ' + keys[i] + ' ' + options[keys[i]];
  }

  return formatted + ' ' + target;
};
