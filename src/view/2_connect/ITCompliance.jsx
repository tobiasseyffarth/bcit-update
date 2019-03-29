import { Component } from 'react';
import PropTypes from 'prop-types';

import InfraPanel from '../container/InfraPanel';
import InfraView from '../container/InfraView';
import ComplianceView from '../container/ComplianceView';
import './../../App.css';
// import ProjectModel from '../../models/ProjectModel';

export default class StepITCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <section className="container-infra">
          <InfraView />
          <InfraPanel />
        </section>
        <section className="container-compliance">
          <ComplianceView />
        </section>
      </div>
    );
  }
}

StepITCompliance.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
