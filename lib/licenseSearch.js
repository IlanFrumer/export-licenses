var fs = require('fs');
var path = require('path');
var matcher = require('./licenseMatcher');

var searchLicence = function(packagePath) {
  var body,
      file,
      filepath,
      files,
      licenses,
      found = {};

  files = fs.readdirSync(packagePath);

  for (var i = 0; i < files.length; i++) {
    file = files[i];
    filepath = path.resolve(packagePath, file);
    if (fs.lstatSync(filepath).isFile()) {
      body = fs.readFileSync(filepath, "utf-8");
      licenses = matcher(body);
      if (licenses) {
        for(var x=0; x<licenses.length; x++) {
          if (!found[licenses[x]]) {
            found[licenses[x]] = file;
          }
        }
      }
    }
  }

  return Object.keys(found).length ? found : null ;
};


module.exports = searchLicence;