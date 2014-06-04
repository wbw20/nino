#! /usr/bin/env node

var fs = require('fs');
var clean = require('./commands/clean');

/* do we have a makefile? */
if (fs.existsSync('makefile')) {
  console.log('found a makefile');
} else {
  console.log('no makefile present');
}

clean();
