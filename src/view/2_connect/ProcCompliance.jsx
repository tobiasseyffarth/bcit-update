import {Component} from 'react';
import ProjectModel from '../../models/ProjectModel';
import BpmnView from '../BpmnView';
import BpmnPanel from '../BpmnPanel';
import ComplianceView from '../ComplianceView';

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
            <BpmnView view={'connectProcessCompliance'}/>
            <BpmnPanel/>
          </section>
          <section className="container-compliance">
            <ComplianceView />
          </section>
        </div>
    );
  }
}
