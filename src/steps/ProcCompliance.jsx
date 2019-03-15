import { Component } from 'react';
import ProjectModel from './../models/ProjectModel';

export default class StepProcCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    ProjectModel.setName('New Name');
  }

  render() {
    return (
      <div>
        Zuordnung Prozess zu Compliance <br />
        {ProjectModel.getName()}
      </div>
    );
  }
}
