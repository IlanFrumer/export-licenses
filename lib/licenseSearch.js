var fs = require('fs');
var path = require('path');
var matcher = require('./licenseMatcher');

var SPECIFIC_REGEX = /LICENSE/i;
var isSpecific = function(file){ return !!file.match(SPECIFIC_REGEX); };

var searchLicence = function(packagePath) {
  var body,
      file,
      filepath,
      files,
      license,
      licenses,
      found,
      foundMain = {};
      foundFallback = {};

  files = fs.readdirSync(packagePath);
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    filepath = path.resolve(packagePath, file);
    if (fs.lstatSync(filepath).isFile()) {
      body = fs.readFileSync(filepath, "utf-8");
      licenses = matcher(body);
      if (licenses) {
        for(var x =0; x<licenses.length; x++) {
          license = licenses[x];
          // specific filenames (has the word license) get precedence over other files
          found = license.fallback ? foundFallback : foundMain;
          if (!found[license.name] || isSpecific(file)) {
            found[license.name] = file;
          }
        }
      }
    }
  }

  return Object.keys(foundMain).length ? foundMain :
         Object.keys(foundFallback).length ? foundFallback : null;
};

module.exports = searchLicence;