import { Menubar } from 'primereact/menubar';
import React, { Component } from 'react';
import AboutDialog from './dialog/AboutDialog';
import GraphDialog from './dialog/GraphDialog';
import ProjectModel from './../models/ProjectModel';
import PropTypes from "prop-types";
import * as ProjectIo from './../controller/helpers/projectio';

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAbout: false,
      visibleGraph: false,
    };

    this.newProject = this.newProject.bind(this);
    this.openProject = this.openProject.bind(this);
    this.exportProject = this.exportProject.bind(this);
    this.exportBpmn = this.exportBpmn.bind(this);
    this.showAboutDialog = this.showAboutDialog.bind(this);
    this.showGraphDialog = this.showGraphDialog.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  onHide() {
    this.setState({ visibleAbout: false });
    this.setState({ visibleGraph: false });
  }

  showAboutDialog() {
    this.setState({ visibleAbout: true });
  }

  newProject = () => {
    this.onHide();
    history.pushState({id: 'homepage'}, 'Home | My App', '/import');
    location.reload();
    ProjectIo.newProject();
  };

  async openProject (){
    ProjectIo.openProject();
  }

  async exportProject () {
    ProjectIo.exportProject();
  }

  showGraphDialog() {
    this.setState({ visibleGraph: true });
  }

  async exportBpmn() {
    ProjectIo.exportBpmn();
  }

  render() {
    const items = [
      {
        label: 'File',
        items: [
          {
            label: 'New Project',
            command: () => { this.newProject(); },
          },
          {
            label: 'Open Project',
            command: () => { this.openProject(); },
          },
          {
            label: 'Export Project',
            command: () => { this.exportProject(); },
          },
          {
            separator: true,
          },
          {
            label: 'View Graph',
            command: () => { this.showGraphDialog(); },
          },
          {
            label: 'Export BPMN',
            command: () => { this.exportBpmn(); },
          },
        ],
      },
    ];

    return (
      <div>
        <AboutDialog showAboutDialog={this.state.visibleAbout} close={this.onHide} />
        <GraphDialog showGraphDialog={this.state.visibleGraph} close={this.onHide} />
        <Menubar model={items}>
          <p className="p-menuitem p-menuitem-link" onClick={this.showAboutDialog}>About</p>
        </Menubar>
      </div>
    );
  }
}

TopMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};