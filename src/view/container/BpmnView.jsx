import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import cytoscape from 'cytoscape';
import AlternativeView from './AlternativeView';
import ProjectModel from '../../models/ProjectModel';
import * as ProcessQuery from '../../controller/process/ProcessQuery';
import * as AnalyzeChange from './../../controller/analyze/AnalyzeChange';
import * as GraphRenderer from './../../controller/graph/GraphRenderer';
import * as GraphQuery from './../../controller/graph/GraphQuery';

class BpmnView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bpmnShape: null,
      alternativeProcess: [
        { name: 'alternative 1' },
        { name: 'alternative 2' },
      ],
      visibleRemove: false,
      visibleChange: false,
      visibleAlternative: false,
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null,
      nodeProps: [],
    };

    this.onHide = this.onHide.bind(this);
    this.showAlternativeDialog = this.showAlternativeDialog.bind(this);
  }

  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      height: '400px',
    });

    this.hookBpmnEventBus();

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderDiagram(ProjectModel.getBpmnXml());
    }
  }

  onHide() {
    this.setState({ visibleRemove: false });
    this.setState({ visibleChange: false });
    this.setState({ visibleAlternative: false });
  }

  showAlternativeDialog(){
    this.setState({ visibleAlternative: true });
  }

  hookBpmnEventBus() {
    const eventBus = this.bpmnModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookBpmnOnClick(e));
  }

  hookBpmnOnClick(e) {
    const pressCrtl = e.originalEvent.ctrlKey;

    if (pressCrtl){
      this.getChangeGraph(e);
    } else {
      this.getRemoveGraph(e);
    }
  }

  hookGraphOnClick(graph){
    const _this = this;

    graph.on('click', (evt) => { // http://js.cytoscape.org/#core/events
      const element = evt.target;
      if (element === graph) { // background
        _this.renderGraphProps(null);
      } else if (element.isNode()) { // edge
        _this.renderGraphProps(element);
      }
    });
  }

  getRemoveGraph(e){
    const shape = e.element;
    const graph = ProjectModel.getGraph();
    let deleteGraph = AnalyzeChange.getDeleteGraph({shape: shape}, graph);

    if(!deleteGraph){
      this.growl.show({ severity: 'warn', summary: 'Can not analyze element', detail: 'Can not analyze this element.' });
    } else {
      if (deleteGraph !== null && deleteGraph.nodes().length > 1){
        this.setState({ visibleRemove: true }, () => {
              this.renderRemoveGraph(deleteGraph)
            },
        );
        console.log('violated req', GraphQuery.filterNodes(deleteGraph, { style: 'violated', type: 'compliance' }));
      }
      if (deleteGraph !== null && deleteGraph.nodes().length <= 1){
        const detail = 'no violations found';
        this.growl.show({ severity: 'info', summary: 'No compliance violation', detail });
      }
    }
  }

  getChangeGraph(e){
    const shape = e.element;
    const graph = ProjectModel.getGraph();
    let changeGraph = AnalyzeChange.getChangeGraph({shape: shape}, graph);

    if(!changeGraph){
      this.growl.show({ severity: 'warn', summary: 'Can not analyze element', detail: 'Can not analyze this element.' });
    } else {
      if (changeGraph !== null && changeGraph.nodes().length > 1){
        this.setState({ visibleChange: true }, () => {
              this.renderChangeGraph(changeGraph);
            },
        );
      }
      if (changeGraph !== null && changeGraph.nodes().length <= 1){
        const detail = 'no demands found';
        this.growl.show({ severity: 'info', summary: 'No compliance violation', detail });
      }
    }
  }

  renderRemoveGraph(graph) {
    const containerRemove = document.getElementById('graph-container-remove');
    const graphDelete = cytoscape({
      container: containerRemove,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'white',
            'border-style': 'solid',
            'border-color': 'black',
            'border-width': 1,
            label: 'data(display_name)',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 20,
            shape: 'rectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#666',
            'mid-target-arrow-color': '#666',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    GraphRenderer.renderAnalyzeGraph(graphDelete, graph);
    this.hookGraphOnClick(graphDelete);
  }

  renderChangeGraph(graph) {
    const containerChange = document.getElementById('graph-container-change');
    const graphChange = cytoscape({
      container: containerChange,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'white',
            'border-style': 'solid',
            'border-color': 'black',
            'border-width': 1,
            label: 'data(display_name)',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 20,
            shape: 'rectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#666',
            'mid-target-arrow-color': '#666',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    GraphRenderer.renderAnalyzeGraph(graphChange, graph);
    this.hookGraphOnClick(graphChange);
  }

  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        ProjectModel.setViewer(this.bpmnModeler);
        const process = ProcessQuery.getProcess(this.bpmnModeler);
        ProjectModel.setProcess(process);
        const canvas = this.bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  };

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
      </div>
    );
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
      }
    } else {
      this.setState({ nodeId: null });
      this.setState({ nodeName: null });
      this.setState({ nodeType: null });
      this.setState({ modelType: null });
      this.setState({ nodeProps: [] });
    }
  }

  renderAlternativeDialog(){
    const footer = (
      <div>
        <Button label="close" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Graph Remove"
          footer={footer}
          visible={this.state.visibleAlternative}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          maximizable
        >
          <section className="container-graph">
            <AlternativeView />
          </section>
        </Dialog>
      </div>
    );
  }

  renderRemoveDialog() {
    const footer = (
      <div>
        <Button label="show alternatives" onClick={this.showAlternativeDialog} />
        <Button label="close" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Graph Remove"
          footer={footer}
          visible={this.state.visibleRemove}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          maximizable
        >
          <section className="container-graph">
            <div className="viewer" id="graph-container-remove" />
            {this.renderGraphPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
  }

  renderChangeDialog() {
    const footer = (
      <div>
        <Button label="close" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Graph Change"
          footer={footer}
          visible={this.state.visibleChange}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          maximizable
        >
          <section className="container-graph">
            <div className="viewer" id="graph-container-change" />
            {this.renderGraphPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
  }

  renderTabView(){

  }

  render() {
    return (
      <div>
        <Growl
          ref={(el) => {
          this.growl = el;
        }}
          position="topright"
        />
        <div>
          {this.renderRemoveDialog()}
          {this.renderChangeDialog()}
          {this.renderAlternativeDialog()}
          <div className="viewer">
            <div id="canvas" />
          </div>
        </div>
      </div>
    );
  }
}

export default BpmnView;
