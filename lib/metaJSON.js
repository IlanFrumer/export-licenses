var path = require('path');
var util = require('util');
var assert = require('chai').assert;

var githubusercontent = function(url) {
  return url
    .replace('git://github.com', 'https://github.com')
    .replace('.git', '')
    .replace(/\/blob/g, '')
    .replace(/\/raw/g, '')
    .replace(/^https?:\/\/github\.com/g, 'https://raw.githubusercontent.com')
    .replace(/^git@github\.com:(.+?)\//g, 'https://raw.githubusercontent.com/$1/');
};

var licenseNormalize = function(license) {
  if (util.isArray(license)) {
    return license;
  } else if (typeof license === 'object') {
    return [ license ];
  } else if (typeof license === 'string') {
    return [{ type: license }];
  } else {
    return null;
  }
};

var getMetaBower = function(dir) {
  var jsonPath = path.resolve(dir, '.bower.json');
  var json = require(jsonPath);
  assert.isString(json._source);

  return {
    url: githubusercontent(json._source),
    tag: json._resolution.tag || json._resolution.commit,
    license: licenseNormalize(json.license)
  };
};

var getMetaNpm = function(dir) {
  var jsonPath = path.resolve(dir, 'package.json');
  var json = require(jsonPath);
  var url = json.repository && json.repository.url ? githubusercontent(json.repository.url) : null;

  return {
    url: url,
    tag: json.gitHead || 'master',
    license: licenseNormalize(json.license || json.licenses)
  };
};

var merge = function(name, found, meta) {
  var result = { name: name, licenses: null };

  if(found) {
    result.licenses = [];
    for(var type in found) {
      if(found.hasOwnProperty(type)) {
        result.licenses.push({
          type: type,
          url: meta.url + '/' + meta.tag + '/' + found[type]
        });
      }
    }
  } else {
    result.licenses = meta.license;
  }

  return result;
};

module.exports = {
  bower: getMetaBower,
  npm: getMetaNpm,
  merge: merge
};