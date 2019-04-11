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
          "function-paren-newline": "off",
          "linebreak-style": "off",
          "no-unused-state": "off",
          "react/prop-types": "off",
          "react/no-unused-state": "off",
          "react/prefer-stateless-function": "off",
          "no-underscore-dangle": "off",
          "max-len": "off"
        },

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
