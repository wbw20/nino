var _ = require('underscore');

module.exports = function(command, options, target) {
  var keys = _.keys(options)

  return command + _.reduce(keys, function(built, key) {
    return built + ' ' + key + ' ' + options[key];
  }, ' ') + ' ' + target;
};
