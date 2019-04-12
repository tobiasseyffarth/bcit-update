import { Menubar } from 'primereact/menubar';
import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Link } from 'react-router-dom';
import { ListBox } from 'primereact/listbox';
import ProjectModel from './../models/ProjectModel';
import * as GraphRenderer from "../controller/graph/GraphRenderer";

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleAbout: false,
      visibleGraph: false,
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null,
      nodeProps: [],
    };

    this.exportBpmn = this.exportBpmn.bind(this);
    this.showAboutDialog = this.showAboutDialog.bind(this);
    this.renderGraphView = this.renderGraphView.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  onHide() {
    this.setState({ visibleAbout: false });
    this.setState({ visibleGraph: false });
  }

  showAboutDialog() {
    this.setState({ visibleAbout: true });
  }

  renderGraphProps(node){
    if (node !== null) {
      this.setState({ nodeId: node.data('id')});
      this.setState({ nodeName: node.data('name') });
      this.setState({ nodeType: node.data('nodetype') });
      this.setState({ modelType: node.data('modeltype') });
      this.setState({ nodeProps: node.data('props') });
    } else {
      this.setState({ nodeId: null });
      this.setState({ nodeName: null });
      this.setState({ nodeType: null });
      this.setState({ modelType: null });
      this.setState({ nodeProps: []});
    }
  }

  hookGraphOnClick(graph){
    const _this = this;

    graph.on('tap', (evt) => { // http://js.cytoscape.org/#core/events
      const element = evt.target;
      if (element === graph) { // background
        _this.renderGraphProps(null);
      } else {
        if (element.isNode()) { // edge
          _this.renderGraphProps(element);
        }
        if (element.isEdge()) {
          console.log('taped on edge');
        }
      }
    });
  }

  renderGraphView(){
    this.setState({ visibleGraph: true }, () => {
      const container = document.getElementById('graph-container');
      let graph = ProjectModel.getGraph();
      graph.mount(container);

      const layout = graph.layout({ name: 'breadthfirst' }); // more options http://js.cytoscape.org/#layouts
      layout.run(); // graph.autolock(false); //elements can not be moved by the user
      GraphRenderer.resizeGraph(graph);
      GraphRenderer.colorNodes(graph);
      this.hookGraphOnClick(graph);
    });
  }

  exportBpmn(){
    console.log(ProjectModel.getViewer());
  }

  renderGraphPropsPanel() {
    return (
      <div className="property-panel">
        <div>
          <label>ID: {this.state.nodeId}</label>
        </div>
        <div>
          <label>Name: {this.state.nodeName}</label>
        </div>
        <div>
          <label>Node Type: {this.state.nodeType}</label>
        </div>
        <div>
          <label>Model Type: {this.state.modelType}</label>
        </div>
        <div>
          <ListBox
              options={this.state.nodeProps}
              optionLabel="name"
          />
        </div>
      </div>
    );
  }

  renderGraphDialog(){
    return (
      <div className="content-section implementation">
        <Dialog header="Graph" visible={this.state.visibleGraph} style={{ width: '80vw' }} onHide={this.onHide} maximizable>
          <section className="container-graph">
            <div className="viewer" id="graph-container" />
            {this.renderGraphPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
  }

  renderAboutDialog(){
    return (
        <div className="content-section implementation">
          <Dialog header="About BCIT 2.0" visible={this.state.visibleAbout} style={{ width: '50vw' }} onHide={this.onHide} maximizable>
            About
            ...
          </Dialog>
        </div>
    );
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
            command: () => { this.renderGraphView(); },
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
