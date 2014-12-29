var api = {
  matcher: require('./lib/licenseMatcher.js'),
  search: require('./lib/licenseSearch.js'),
  meta: require('./lib/metaJSON.js'),
  verify: require('./lib/verifyLicenses'),
  print: require('./lib/printLicenses'),
  bower: require('./lib/searchBower.js'),
  npm: require('./lib/searchNpm.js')
};

module.exports = api;