const { Neutrino } = require('neutrino');

module.exports = Neutrino({ root: __dirname })
  .use('@neutrinojs/airbnb', {
    eslint: {
      rules: { semi: 'off' }
    }
  })
  .use('.neutrinorc.js')
  .call('eslintrc');
