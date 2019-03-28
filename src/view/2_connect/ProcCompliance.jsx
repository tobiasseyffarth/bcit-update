import { Component } from 'react';
import ProjectModel from '../../models/ProjectModel';
import BpmnView from '../BpmnView';
import BpmnPanel from '../BpmnPanel';

export default class StepProcCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    ProjectModel.setName('New Name');
  }

  render() {
    return (
      <div>
        <BpmnView />
        <BpmnPanel />
      </div>
    );
  }
}
