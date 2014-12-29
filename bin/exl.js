#!/usr/bin/env node
'use strict';

var log = console.log;
var minimist = require('minimist');
var colors = require('colors');

var FLAGS = [
  { flag: 'npm',     alias: 'n', desc: 'get npm dependencies liscenses' },
  { flag: 'bower',   alias: 'b', desc: 'get bower dependencies liscenses' },
  { flag: 'dev',     alias: 'd', desc: 'also get liscenses of devDependencies' },
  { flag: 'help',    alias: 'h', desc: 'display help screen' },
  { flag: 'json',    alias: 'j', desc: 'print output as a json object' },
  { flag: 'csv',     alias: 'c', desc: 'print output as csv' },
  { flag: 'silence', alias: 's', desc: 'suppress output' },
  { flag: 'sort'   , alias: 'a', desc: 'print table sorted by license type' },
  { flag: 'version', alias: 'v', desc: 'display the version number' },
  { flag: 'verify',  alias: 'V', desc: 'validate dependencies urls with http requests (requires network connection)' }
];

var flags = [];
var alias = {};
FLAGS.forEach(function(s) {
  flags.push(s.flag);
  alias[s.alias] = s.flag;
});

var unknown = [];
var argv = minimist(process.argv.slice(2), {
  boolean: flags,
  alias: alias,
  unknown: function(v) {
    if (v.indexOf('-') === 0) {
      unknown.push(v);
    }
  }
});

var print = function(title, message) {
  log('\n' + colors.magenta(title + ': ') + colors.grey(message));
};

if (unknown.length > 0) {
  return print('Unknown flags',  unknown.join(' '));
}

if(argv.version) {
  return print('export-licenses',  'version ' + require('../package.json').version);
}

if (argv.help) {
  var Table = require('cli-table');
  var table = new Table({
    chars: {
      'top': '' ,
      'top-mid': '' ,
      'top-left': '' ,
      'top-right': '',
      'bottom': '' ,
      'bottom-mid': '' ,
      'bottom-left': '' ,
      'bottom-right': '',
      'left': '' ,
      'left-mid': '' ,
      'mid': '' ,
      'mid-mid': '',
      'right': '' ,
      'right-mid': '',
      'middle': ' '
    },
    style: {
      'padding-left': 0,
      'padding-right': 2,
      compact : true
    }
  });

  FLAGS.forEach(function(item) {
    table.push([ '--' + item.flag, '-' +item.alias, item.desc]);
  });

  print('Usage', 'exl <flags> [folder]');
  log('');
  log(table.toString());
  return;
}

var verifyPrintLicenses = function(licenses) {
  if (argv.verify) {
    api.verify(licenses , function(licenses) {
      if(!argv.silence) {
        api.print(licenses, argv);
      }
    });
  } else if(!argv.silence) {
    api.print(licenses, argv);
  }
};

var api = require('../index.js');
var dir = argv._[0] || '.';

if (argv.npm || !argv.bower) {
  verifyPrintLicenses(api.npm(dir, argv.dev));
} else if (argv.bower) {
  verifyPrintLicenses(api.bower(dir, argv.dev));
}
