import React, { Component } from 'react';

import ProjectModel from './../models/ProjectModel';

class BpmnPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {

  }


  render() {
    return (
        <div className="BpmnPanel">
          <p>BPMN Panel</p>
        </div>
    );
  }
}

export default BpmnPanel;
