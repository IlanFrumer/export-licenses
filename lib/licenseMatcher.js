var licenses = require('./licenses');
var util = require('util');

function License(def) {
  this.def = def;
  var matchers = util.isArray(def.match) ? def.match : [ def.match ];
  this.matchers = matchers.map(function(matcher) {
    return matcher.toLowerCase();
  });
}

License.prototype.match = function(string) {
  for(var i = 0; i < this.matchers.length; i++) {
    if (string.indexOf(this.matchers[i]) >= 0) {
      return true;
    }
  }

  if (this.def.url && string.indexOf(this.def.url) >= 0) {
    return true;
  }

  return false;
};

licenses = licenses.map(function(license) {
  return new License(license);
});


module.exports = function licenseMatcher(string, nameOnly) {
  var license, found = [];
  string = string.toLowerCase();
  for(var i = 0; i < licenses.length; i++) {
    license = licenses[i];
    if(license.match(string)) {
      found.push(nameOnly ? license.def.name : license.def);
    }
  }

  return found.length ? found : null;
};