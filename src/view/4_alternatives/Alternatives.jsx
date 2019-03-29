import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6

export default class Alternatives extends Component {
  state = {
    // name: 'zeugnis',
  };

  render() {
    return (
      <div>
          Alternatives
      </div>
    );
  }
}

Alternatives.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
