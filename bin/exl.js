#!/usr/bin/env node
'use strict';

var log = console.log;
var minimist = require('minimist');
var colors = require('colors');

var FLAGS = [
  { flag: 'npm',     alias: 'n', desc: 'get npm dependencies liscenses' },
  { flag: 'bower',   alias: 'b', desc: 'get bower dependencies liscenses' },
  { flag: 'dev',     alias: 'd', desc: 'also get liscenses of devDependencies' },
  { flag: 'check',   alias: 'c', desc: 'validate dependencies urls with http requests (requires network connection)' },
  { flag: 'help',    alias: 'h', desc: 'display help screen' },
  { flag: 'json',    alias: 'j', desc: 'print output as a json object' },
  { flag: 'silence', alias: 's', desc: 'suppress output' },
  { flag: 'compact', alias: 't', desc: 'print table in compact table' },
  { flag: 'sort'   , alias: 'a', desc: 'print table sorted by license type' },
  { flag: 'version', alias: 'v', desc: 'display the version number' }
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

if (unknown.length > 0) {
  return log('\n' + colors.magenta('Unknown flags:') + ' ' , colors.grey(unknown.join(' ')));
}


var checkPrintLicenses = function(licenses) {
  if (argv.check) {
    api.check(licenses , function(licenses) {
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

if(argv.version) {
  log(require('../package.json').version);
} else if (argv.help) {
  var Table = require('cli-table');
  var table = new Table({
    style: {
      'padding-left': 1,
      'padding-right': 1,
      compact : true
    }
  });

  FLAGS.forEach(function(item) {
    table.push([ '--' + item.flag, '-' +item.alias, item.desc]);
  });

  log('\nUsage: exl <flags> [folder]');
  log(table.toString());
} else if (argv.npm || !argv.bower) {
  checkPrintLicenses(api.npm(dir, argv.dev));
} else if (argv.bower) {
  checkPrintLicenses(api.bower(dir, argv.dev));
}
