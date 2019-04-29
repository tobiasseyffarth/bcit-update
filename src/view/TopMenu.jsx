import { Menubar } from 'primereact/menubar';
import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import ProjectModel from './../models/ProjectModel';
import AboutDialog from './dialog/AboutDialog';
import * as GraphRenderer from '../controller/graph/GraphRenderer';

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
      removeDisabled: true,
    };

    this.exportBpmn = this.exportBpmn.bind(this);
    this.showAboutDialog = this.showAboutDialog.bind(this);
    this.renderGraphView = this.renderGraphView.bind(this);
    this.onHide = this.onHide.bind(this);
    this.removeNode = this.removeNode.bind(this);
  }

  onHide() {
    this.setState({ visibleAbout: false });
    this.setState({ visibleGraph: false });
  }

  showAboutDialog() {
    this.setState({ visibleAbout: true });
  }

  hookGraphOnClick(graph){
    const _this = this;

    graph.on('click', (evt) => { // http://js.cytoscape.org/#core/events
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

  removeNode(){
    /*
    let graph = ProjectModel.getGraph();
    let node = graph.getElementById(this.state.nodeId);

    if (node !== null) {
      if (node.data('nodetype') === 'compliance'){
        console.log(node);
        GraphEditor.removeNode(node);
        ProjectModel.setGraph(graph);
      }
    }
    */
  }

  renderGraphView(){
    this.setState({ visibleGraph: true }, () => {
      const container = document.getElementById('graph-container');
      const graph = ProjectModel.getGraph();
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

  renderGraphProps(node){
    if (node !== null) {
      this.setState({ nodeId: node.data('id') });
      this.setState({ nodeName: node.data('name') });
      this.setState({ nodeType: node.data('nodetype') });
      this.setState({ modelType: node.data('modeltype') });

      const nodeType = node.data('nodetype');
      if (nodeType !== 'compliance'){ // non compliance nodes
        this.setState({ nodeProps: node.data('props') });
      } else { // compliance nodes
        this.setState({ nodeProps: [] });
        this.setState({ removeDisabled: false });
      }
    } else {
      this.setState({ nodeId: null });
      this.setState({ nodeName: null });
      this.setState({ nodeType: null });
      this.setState({ modelType: null });
      this.setState({ nodeProps: [] });
      this.setState({ removeDisabled: true });
    }
  }

  renderGraphPropsPanel() {
    return (
      <div className="property-panel">
        <div>
          <label>ID: {this.state.nodeId}</label>
        </div>
        <br />
        <div>
          <label>Name: {this.state.nodeName}</label>
        </div>
        <br />
        <div>
          <label>Node Type: {this.state.nodeType}</label>
        </div>
        <br />
        <div>
          <label>Model Type: {this.state.modelType}</label>
        </div>
        <br />
        <div>
          <ListBox
            style={{ width: '100%' }}
            options={this.state.nodeProps}
            optionLabel="name"
          />
        </div>
        <br />
        <div>
          <Button
            label="remove compliance node"
            onClick={this.removeNode}
            tooltip="remove compliance node"
            disabled={this.state.removeDisabled}
          />
        </div>
      </div>
    );
  }

  renderGraphDialog(){
    const footer = (
      <div>
        <Button label="close" icon="pi pi-check" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog header="Graph"
            footer={footer}
            visible={this.state.visibleGraph}
            style={{ width: '80vw' }}
            onHide={this.onHide}
            maximizable>
          <section className="container-graph">
            <div className="viewer" id="graph-container" />
            {this.renderGraphPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
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
        <AboutDialog showAboutDialog={this.state.visibleAbout} close={this.onHide}/>
        {this.renderGraphDialog()}
        <Menubar model={items}>
            <p className="p-menuitem p-menuitem-link" onClick={this.showAboutDialog}>About</p>
        </Menubar>
      </div>
    );
  }
}
