var _ = require('underscore');

var environment = require('./environment.js');

var boards = [{
  name: 'Arduino Uno',
  test: function(vendorId, productId) {
    return vendorId == '0x2341' && productId == '0x0043';
  },
  options: {
    sArgs: {
      '-c': '',
      '-g': '',
      '-x': 'assembler-with-cpp'
    },
    cArgs: {
      '-c': '',
      '-g': '',
      '-Os': '',
      '-MMD': '',
      '-ffunction-sections': '',
      '-fdata-sections': ''
    },
    cppArgs: {
      '-c': '',
      '-g': '',
      '-Os': '',
      '-w': '',
      '-MMD': '',
      '-ffunction-sections': '',
      '-fdata-sections': '',
      '-fno-exceptions': ''
    },
    linking: {
      '-Os': '',
      '-WI,--gc-sections': '',
      '-mmcu=atmega328p': ''
    },
    copy: {
      '-O': 'ihex',
      '-R': '.eeprom'
    },
    transform: {
      '-O': 'ihex',
      '-j': '.eeprom',
      '--set-section-flags=.eeprom=alloc,load': '',
      '--no-change-warnings': '',
      '--change-section-lma': '',
      '.eeprom=0': ''
    },
    erase: {
      '-c': 'arduino',
      '-p': 'ATMEGA328P',
      '-b': '115200',
      '-C': environment.avrconf()
    }
  }
}, {
  name: 'Apollo',
  test: function(vendorId, productId) {
    return vendorId == '0x2341' && productId == '0x003e';
  },
  options: {
    sArgs: {
      '-c': '',
      '-g': '',
      '-x': 'assembler-with-cpp'
    },
    cArgs: {
      '-c': '',
      '-g': '',
      '-Os': '',
      '-MMD': '',
      '-ffunction-sections': '',
      '-fdata-sections': ''
    },
    cppArgs: {
      '-c': '',
      '-g': '',
      '-Os': '',
      '-w': '',
      '-MMD': '',
      '-ffunction-sections': '',
      '-fdata-sections': '',
      '-fno-exceptions': ''
    },
    linking: {
      '-Os': '',
      '-WI,--gc-sections': '',
      '-mmcu=atmega328p': ''
    },
    copy: {
      '-O': 'ihex',
      '-R': '.eeprom'
    },
    transform: {
      '-O': 'ihex',
      '-j': '.eeprom',
      '--set-section-flags=.eeprom=alloc,load': '',
      '--no-change-warnings': '',
      '--change-section-lma': '',
      '.eeprom=0': ''
    },
    erase: {
      '-c': 'arduino',
      '-p': 'ATmega16U2',
      '-b': '115200',
      '-C': environment.avrconf()
    }
  }
}];

module.exports = {
  get: function(vendorId, productId) {
    return _.find(boards, function(board) {
      if (board.test(vendorId, productId)) {
        return board;
      }
    });
  }
};
