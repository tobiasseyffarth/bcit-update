import { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import InfraPanel from './../InfraPanel';
import InfraView from './../InfraView';
import BpmnView from '../BpmnView';
import BpmnPanel from '../BpmnPanel';
// import ProjectModel from '../../models/ProjectModel';

export default class StepProcIT extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <section className="container-process">
          <BpmnView view="connectProcessInfra" />
          <BpmnPanel />
        </section>
        <section className="container-infra">
          <InfraView />
          <InfraPanel />
        </section>
      </div>
    );
  }
}

StepProcIT.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
