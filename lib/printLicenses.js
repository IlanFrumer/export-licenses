var log = console.log;
var colors = require('colors');
var Table = require('cli-table');

var CHECKED_MARK = colors.green('✔');
var X_MARK = colors.red('✘');

var iterateLicenses = function(licenses, cb) {
  var item,
      license,
      name;

  for(var l in licenses) {
    if (licenses.hasOwnProperty(l)) {
      item = licenses[l];
      name = item.name || '';
      for (var i = 0; i < item.licenses.length; i++) {
        license = item.licenses[i];
        cb(name, license);
      }
    }
  }
};

var printLicenses = function(licenses, options) {
  if (options.json) {
    log(JSON.stringify(licenses,null,2));
  } else if (options.csv) {
    var output = [];
    if (options.verify) {
      output.push( [ 'Name', 'License', 'URL', 'Verified' ]);
      iterateLicenses(licenses, function(name, license) {
        output.push([ name, license.type, license.url, license.verified ]);
      });
    } else {
      output.push( [ 'Name', 'License', 'URL' ]);
      iterateLicenses(licenses, function(name, license) {
        output.push([ name, license.type, license.url ]);
      });
    }
    log(output.join('\n'));
  } else {
    var table = new Table({
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['blue', 'bold'],
        border: ['grey'],
        compact : true
      },
      head: ['Name', 'License', 'URL']
    });

    iterateLicenses(licenses, function(name, license) {
      var verified = options.verify ? (license.verified ? CHECKED_MARK : X_MARK) + ' ' : '';
      var type = colors.magenta(license.type || 'None');
      var url = (verified) + (license.url || 'None');
      table.push([ name , type , url ]);
    });

    if (options.sort) {
      table.sort(function(a,b) { return a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]); });
    }

    log(table.toString());
  }
};

module.exports = printLicenses;