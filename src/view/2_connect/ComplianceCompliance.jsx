import { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import ComplianceView from '../container/ComplianceView';
// import ProjectModel from '../../models/ProjectModel';

export default class StepComplianceCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ComplianceView />
      </div>
    );
  }
}

StepComplianceCompliance.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
