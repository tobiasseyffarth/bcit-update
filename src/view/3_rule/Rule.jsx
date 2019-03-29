import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6

export default class Rule extends Component {
  state = {
    // name: 'zeugnis',
  };

  render() {
    return (
      <div>
          Rule
      </div>
    );
  }
}

Rule.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
