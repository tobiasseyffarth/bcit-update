import { Component } from 'react';
import ProjectModel from '../../models/ProjectModel';
import BpmnView from '../container/BpmnView';
import BpmnPanel from '../container/BpmnPanel';
import ComplianceView from '../container/ComplianceView';

export default class StepProcCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    ProjectModel.setName('New Name');
  }

  render() {
    return (
      <div>
        <section className="container-process">
          <BpmnView view="connectProcessCompliance" />
          <BpmnPanel />
        </section>
        <section className="container-compliance">
          <ComplianceView />
        </section>
      </div>
    );
  }
}
