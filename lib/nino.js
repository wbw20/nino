#! /usr/bin/env node

var fs = require('fs');

var commands = ['build', 'clean', 'init', 'upload'],
    options = {
      command: 'clean',
      path: '.'
    },
    args = process.argv.slice(2);

if (args.length == 0) {
} else if (args.length == 1) {
  if (commands.indexOf(args[0]) == -1) {
    console.log('invalid command: ' + args[0]);
    process.exit(1); // failure
  } else {
    options.command = args[0];
  }
} else if (args.length == 2) {
  if (!fs.existsSync(args[1])) {
    console.log('path not found: ' + args[1]);
    process.exit(1); // failure
  } else {
    options.path = args[1];
  }
} else {
  console.log('syntax error');
}

require('./commands/' + options.command).execute(options.path);
