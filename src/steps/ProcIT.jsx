import { Component } from 'react';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types'; // ES6

import ProjectModel from './../models/ProjectModel';

export default class StepProcIT extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        Zuordnung Prozess zu IT <br />
        {ProjectModel.getName()}
        <Button
          label="Next"
        />
      </div>
    );
  }
}

StepProcIT.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
