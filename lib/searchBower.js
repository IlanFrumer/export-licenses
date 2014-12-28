var fs = require('fs');
var path = require('path');

var meta = require('./metaJSON');
var licenseSearch = require('./licenseSearch.js');

var getDependenciesLicenses = function(licenses, dependencies, dir, components) {
  var metaData,
      modulePath,
      found;

    // TODO: verify bower installed correctly
    for(var name in dependencies) {
      if(licenses.hasOwnProperty(name)) { continue; }
      modulePath = path.resolve(dir, components, name);
      metaData = meta.bower(modulePath);
      found = licenseSearch(modulePath);
      licenses[name] = meta.merge(name, found, metaData);
    }

    return licenses;
};

var getBowerFolder = function(dir) {
  try {
    var bowerrcPath = path.join(dir, '.bowerrc');
    var bowerrc = fs.readFileSync(bowerrcPath).toString();
    return JSON.parse(bowerrc).directory;
  } catch (e) {
    return 'bower_components';
  }
};

var searchBower = function(dir, devDependencies) {
  // TODO: error bower.json not found
  var json = require(path.resolve(dir, 'bower.json'));
  // TODO: error parsing bowerrc
  var components = getBowerFolder(dir);

  var licenses = {};

  getDependenciesLicenses(licenses, json.dependencies, dir, components);

  if (devDependencies) {
    getDependenciesLicenses(licenses, json.devDependencies, dir, components);
  }

  return licenses;
};

module.exports = searchBower;
