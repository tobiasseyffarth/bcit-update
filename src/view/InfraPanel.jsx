import React, { Component } from 'react';
import './../App.css';
import ProjectModel from './../models/ProjectModel';

class InfraPanel extends Component {
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
        <div className="property-panel">
          <p>Infra Panel</p>
        </div>
    );
  }
}

export default InfraPanel;
