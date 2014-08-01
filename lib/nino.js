module.exports = {
  build: require('./commands/build'),
  clean: require('./commands/clean'),
  erase: require('./commands/erase'),
  init: require('./commands/init'),
  list: require('./commands/list'),
  serial: require('./commands/serial'),
  upload: require('./commands/upload')
};
