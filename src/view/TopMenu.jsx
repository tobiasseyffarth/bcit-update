import { Menubar } from 'primereact/menubar';
import React, { Component } from 'react';
import ProjectModel from './../models/ProjectModel';
import AboutDialog from './dialog/AboutDialog';
import GraphDialog from './dialog/GraphDialog';

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAbout: false,
      visibleGraph: false,
    };

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

  showGraphDialog() {
    this.setState({ visibleGraph: true });
  }

  exportBpmn(){
    console.log(ProjectModel.getViewer());
  }

  render() {
    const items = [
      {
        label: 'File',
        items: [
          {
            label: 'New Project',
          },
          {
            label: 'Open Project',
          },
          {
            label: 'Save Project',
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
        <AboutDialog showAboutDialog={this.state.visibleAbout} close={this.onHide}/>
        <GraphDialog showGraphDialog={this.state.visibleGraph} close={this.onHide}/>
        <Menubar model={items}>
            <p className="p-menuitem p-menuitem-link" onClick={this.showAboutDialog}>About</p>
        </Menubar>
      </div>
    );
  }
}
