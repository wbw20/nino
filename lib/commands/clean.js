var environment = require('../util/environment');

module.exports = {
  execute: function(path) {
    console.log(environment.project());
    console.log(environment.install());
  }
};
