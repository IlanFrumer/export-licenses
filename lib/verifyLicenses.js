var matcher = require('./licenseMatcher.js');
var request = require('request');
var util = require('util');
var Q = require('q');

var indexOf = function(str, array) {
  return Array.isArray(array) && array.indexOf(str) >= 0;
};

var verifyLicense = function(license) {
  if (license.url) {
    var deffered = Q.defer();
    request({
      uri: license.url,
      method: "GET",
    }, function(error, response, body) {
      license.verified = !error && (response.statusCode === 200) && (indexOf(license.type, matcher(body, true)));
      deffered.resolve();
    });
    return deffered.promise;
  } else {
    return true;
  }
};

var verifyLicenses = function (licenses, cb) {
  var promises = [];

  for(var name in licenses) {
    if (licenses.hasOwnProperty(name)) {
      for(var i = 0; i < licenses[name].licenses.length; i++) {
        promises.push(verifyLicense(licenses[name].licenses[i]));
      }
    }
  }

  Q.all(promises).then(function() {
    cb(licenses);
  }).fail(function(e) {
    console.error(e);
  });
};

module.exports = verifyLicenses;