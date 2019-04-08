import { Menubar } from 'primereact/menubar';
import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import ProjectModel from './../models/ProjectModel';

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAbout: false,
      visibleGraph: false,
    };

    this.exportBpmn = this.exportBpmn.bind(this);
    this.showAboutDialog = this.showAboutDialog.bind(this);
    this.showGraphView = this.showGraphView.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  onHide(event) {
    this.setState({visibleAbout: false});
    this.setState({visibleGraph: false});
  }

  showAboutDialog() {
    this.setState({ visibleAbout: true });
  }

  showGraphView(){
    this.setState({ visibleGraph: true });
  }

  exportBpmn(){
    console.log(ProjectModel.getViewer());
  }

  renderAboutDialog(){
    return (
      <div className="content-section implementation">
        <Dialog header="About BCIT 2.0" visible={this.state.visibleAbout} style={{width: '50vw'}} onHide={this.onHide} maximizable>
          About
          ...
        </Dialog>
      </div>
    )
  }

  renderGraphDialog(){
    return (
      <div className="content-section implementation">
        <Dialog header="Graph" visible={this.state.visibleGraph} style={{width: '50vw'}} onHide={this.onHide} maximizable>
          Graph
        </Dialog>
      </div>
    )
  }

  render() {
    const items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
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
            command: () => { this.showGraphView(); },
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
        {this.renderAboutDialog()}
        {this.renderGraphDialog()}
        <Menubar model={items}>
          <p className="p-menuitem">
            <Link href="/about" to="/about" className="p-menuitem-link" onClick={this.showAboutDialog}>
              <span className="p-menuitem-text">About</span>
            </Link>
          </p>
        </Menubar>
      </div>
    );
  }
}
