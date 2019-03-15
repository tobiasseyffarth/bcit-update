module.exports = {
  use: [
    ['@neutrinojs/airbnb', {
      eslint: {
        rules: {
          "jsx-a11y/label-has-for": "off",
          "space-before-blocks": "off",
          "no-plusplus": "off",
          "no-console": "off",
          "no-await-in-loop": "off",
          "consistent-return": "off",
          "function-paren-newline": "off",
          "linebreak-style": "off"
        }
      }
    }],
    [
      '@neutrinojs/react',
      {
        html: {
          title: 'Compliance Checker'
        }
      }
    ],
    ['@neutrinojs/dev-server', {
      publicPath: '/'
    }]
  ]
};
