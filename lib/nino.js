#! /usr/bin/env node

var minimist = require('minimist'),
    _        = require('underscore');

var args     = minimist(process.argv.slice(2)),
    command  = args._[0],
    commands = {
      'build' : require('./commands/build').execute,
      'erase' : require('./commands/erase').execute,
      'list'  : require('./commands/list').list,
      'serial': require('./commands/serial').execute,
      'upload': require('./commands/upload').execute
    };

var help = 'Usage: nino [command] [options...]\n\n' +
           '       command: | build\n' +
           '                | erase\n' +
           '                | list\n' +
           '                | serial\n' +
           '                | upload\n';

if (!command || _.keys(commands).indexOf(command) === -1) {
  console.log(help); process.exit(0);
}

commands[command]();
