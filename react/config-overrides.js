const {alias, configPaths} = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias(configPaths('./jsconfig.paths.json'))(config);

  return config;
}
