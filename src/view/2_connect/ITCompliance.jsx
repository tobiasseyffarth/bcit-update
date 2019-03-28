import { Component } from 'react';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';

import InfraPanel from './../InfraPanel';
import InfraView from './../InfraView';
import ComplianceView from './../ComplianceView';
import './../../App.css';

import ProjectModel from '../../models/ProjectModel';

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
