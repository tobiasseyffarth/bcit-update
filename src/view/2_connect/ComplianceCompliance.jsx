import { Component } from 'react';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types'; // ES6

import ProjectModel from '../../models/ProjectModel';

export default class StepComplianceCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
          Zuordnung Compliance zu Compliance<br />
        {ProjectModel.getName()}
        <Button
          label="Next"
        />
      </div>
    );
  }
}

StepComplianceCompliance.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
