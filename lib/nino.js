module.exports = {
  build: require('./commands/build').execute,
  clean: require('./commands/clean').execute,
  erase: require('./commands/erase').execute,
  init: require('./commands/init').execute,
  list: require('./commands/list').execute,
  serial: require('./commands/serial').execute,
  upload: require('./commands/upload').execute
};
