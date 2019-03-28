import React, { Component } from 'react';
import './../App.css';
import ProjectModel from './../models/ProjectModel';

class InfraView extends Component {
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
        <div className="viewer">
          <p>Infra View</p>
        </div>
    );
  }
}

export default InfraView;
