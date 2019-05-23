import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import * as AlternativeFinder from './../../controller/adapt/AlternativeFinder';
import * as ProcessQuery from './../../controller/process/ProcessQuery';
import * as GraphQuery from './../../controller/graph/GraphQuery';
import * as ProcessRenderer from './../../controller/process/ProcessRenderer';

class AlternativeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alternativeProcess: [
        { name: 'alternative 1' },
        { name: 'alternative 2' },
      ],
      selectedProcess: null,
      visibleAlternative: false,
      bpmnModeler: null,
    };

    this.renderAlternativeProcess = this.renderAlternativeProcess.bind(this);
    this.exportProcess = this.exportProcess.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visibleAlternative: nextProps.showAlternative });
  }

  onHide() {
    this.props.close();
    this.setState({ visibleAlternative: false });
  }

  onShow() {
    const propsPanel = document.getElementById('alternative-panel');
    const height = propsPanel.offsetHeight;

    if (this.bpmnAltModeler === undefined){
      this.bpmnAltModeler = new BpmnModeler({
        container: '#alternative',
        height: height,
      });
    }

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmn(ProjectModel.getBpmnXml());
    }

    if (ProjectModel.getRemoveGraph() !== null) {
      this.removeGraph = ProjectModel.getRemoveGraph();
    }

    if (ProjectModel.getAltGraph() !== null) {
      this.altGraph = ProjectModel.getAltGraph();
    }

    AlternativeFinder.getAlternatives(this.altGraph, this.removeGraph);
  }

  hookBpmnOnClick(e) {
    const { element } = e;
    console.log(element);
  }

  hookBpmnEventBus(){
    const eventBus = this.bpmnAltModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookBpmnOnClick(e));
  }

  highlightOriginalProcess(){
    const process = ProcessQuery.getProcess(this.bpmnAltModeler);
    const flowNodes = ProcessQuery.getFlowNodesOfProcess(process);
    const graph = this.removeGraph;
    const violatedElements = GraphQuery.filterNodes(graph, { style: 'violated'});
    const obsoleteElements = GraphQuery.filterNodes(graph, { style: 'obsolete'});
    const changedElements = GraphQuery.filterNodes(graph, { style: 'changedElement'});

    for (let i = 0; i < flowNodes.length; i++) {
      const node = flowNodes[i];
      for (let j = 0; j < violatedElements.length; j++) {
        const violatedElement = violatedElements[j].data();
        if (node.name !== undefined) {
          if (node.name === violatedElement.display_name){
            const shape = ProcessQuery.getShapeOfRegistry(this.bpmnAltModeler, node.id);
            const isCompliance = ProcessQuery.isCompliance(node);
            if (isCompliance) {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'red', fill: 'grey'});
            } else {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'red'});
            }
          }
        }
      }

      for (let j = 0; j < obsoleteElements.length; j++) {
        const obsoleteElement = obsoleteElements[j].data();
        if (node.name !== undefined) {
          if (node.name === obsoleteElement.display_name){
            const shape = ProcessQuery.getShapeOfRegistry(this.bpmnAltModeler, node.id);
            const isCompliance = ProcessQuery.isCompliance(node);
            if (isCompliance) {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'blue', fill: 'grey'});
            } else {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'blue'});
            }
          }
        }
      }

      for (let j = 0; j < changedElements.length; j++) {
        const changedElement = changedElements[j].data();
        if (node.name !== undefined) {
          if (node.name === changedElement.display_name){
            const shape = ProcessQuery.getShapeOfRegistry(this.bpmnAltModeler, node.id);
            const isCompliance = ProcessQuery.isCompliance(node);
            if (isCompliance) {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'orange', fill: 'grey'});
            } else {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'orange'});
            }
          }
        }
      }
    }
  }

  getAlternativeProcesses(){

  }

  renderBpmn = (xml) => {
    this.bpmnAltModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.bpmnAltModeler.get('canvas');
        canvas.zoom('fit-viewport');
        this.hookBpmnEventBus();
        this.highlightOriginalProcess();
        this.getAlternativeProcesses();
      }
    });
  };

  renderAlternativeProcess = (option) => {
    console.log('render', option);
    this.setState({ selectedProcess: option});
  };

  exportProcess = () => {
    console.log('export process', this.state.selectedProcess);
  };

  renderAlternativePanel(){
    return (
      <div className="property-panel" id="alternative-panel">
        <ListBox
          style={{ width: '100%' }}
          value={this.state.selectedProcess}
          options={this.state.alternativeProcess}
          optionLabel="name"
          onChange={(e) => this.renderAlternativeProcess(e.value)}
        />
        <br />
        <Button
          label="export process"
          onClick={this.exportProcess}
        />
      </div>
    )
  }

  renderPropsPanel(){
    return (
      <div className="property-panel">
        <ListBox
          style={{ width: '100%' }}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="content-section implementation">
        <Dialog
          header="Alternative Processes"
          visible={this.state.visibleAlternative}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          onShow={() => this.onShow()}
          maximizable
        >
          <section className="container-process">
            {this.renderAlternativePanel()}
            <div className="viewer" style={{ width: '60vw' }}>
              <div id="alternative" />
            </div>
            {this.renderPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
  }
}

export default AlternativeDialog;
