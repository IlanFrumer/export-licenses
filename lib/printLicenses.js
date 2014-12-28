var log = console.log;
var colors = require('colors');
var Table = require('cli-table');

var CHECKED_MARK = colors.green('✔');
var X_MARK = colors.red('✘');

var printLicenses = function(licenses, options) {
  if (options.json) {
    log(JSON.stringify(licenses,null,2));
  } else {

    var table,
        item,
        license,
        name,
        checked,
        type,
        url;

    table = new Table({
      style: {
        'padding-left': 1,
        'padding-right': 1,
        head: ['blue', 'bold'],
        border: ['grey'],
        compact : options.compact
      },
      head: ['Name', 'License', 'URL']
    });

    for(var l in licenses) {
      if (licenses.hasOwnProperty(l)) {
        item = licenses[l];
        name = item.name || '';
        for (var i = 0; i < item.licenses.length; i++) {
          license = item.licenses[i];
          checked = options.check ? (license.checked ? CHECKED_MARK : X_MARK) + ' ' : '';
          type = colors.magenta(license.type || 'None');
          url = (checked) + (license.url || 'None');
          table.push([ name , type, url]);
        }
      }
    }

    if (options.sort) {
      table.sort(function(a,b) { return a[1].localeCompare(b[1]) || a[0].localeCompare(b[0]); });
    }

    log(table.toString());
  }
};

module.exports = printLicenses;