module.exports = {
  build: require('./commands/build').execute,
  erase: require('./commands/erase').execute,
  list: require('./commands/list').list,
  serial: require('./commands/serial').execute,
  upload: require('./commands/upload').execute
};
