var path = require('path');
var semver = require('semver');

var meta = require('./metaJSON');
var licenseSearch = require('./licenseSearch.js');

var getDependenciesLicenses = function(licenses, dependencies, dir) {
  var metaData,
      modulePath,
      range,
      found;

    // TODO: verify npm installed correctly
    for(var name in dependencies) {
      if(licenses.hasOwnProperty(name)) { continue; }
      range = dependencies[name];

      modulePath = semver.validRange(range) ?
                   path.resolve(dir, 'node_modules/', name) :
                   path.resolve(dir, range);

      found = licenseSearch(modulePath);
      metaData = meta.npm(modulePath);
      licenses[name] = meta.merge(name, found, metaData);
    }

    return licenses;
};


var searchNpm = function(dir, devDependencies) {
  // TODO: error package.json not found
  var json = require(path.resolve(dir, 'package.json'));

  var licenses = {};


  getDependenciesLicenses(licenses, json.dependencies, dir);

  if (devDependencies) {
    getDependenciesLicenses(licenses, json.devDependencies, dir);
  }

  return licenses;
};

module.exports = searchNpm;
