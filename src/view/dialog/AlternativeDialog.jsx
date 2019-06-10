import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import * as ProcessAdapter from './../../controller/adapt/ProcessAdaptor';
import * as ProcessQuery from './../../controller/process/ProcessQuery';
import * as GraphQuery from './../../controller/graph/GraphQuery';
import * as ProcessRenderer from './../../controller/process/ProcessRenderer';
import * as FileIo from './../../controller/helpers/fileio';
import * as ProjectIo from './../../controller/helpers/projectio';

class AlternativeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processList: [],
      selectedProcess: null,
      visibleAlternative: false,
      bpmnModeler: null,
    };

    this.selectProcess = this.selectProcess.bind(this);
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
        height,
      });
    }

    this.renderOriginalProcess(ProjectModel.getBpmnXml());
    this.removeGraph = ProjectModel.getRemoveGraph();
    this.altGraph = ProjectModel.getAltGraph();
    this.renderAlternativeProcesses();
  }

  async renderAlternativeProcesses() {
    const altGraph = this.altGraph;
    const removeGraph = this.removeGraph;
    const bpmnXml = ProjectModel.getBpmnXml();
    const altProcesses = await ProcessAdapter.getAdaptedProcesses(altGraph, removeGraph, bpmnXml);
    const processList = this.state.processList;

    for (let i = 0; i < altProcesses.length; i++) {
      const altProc = altProcesses[i];
      processList.push(altProc);
    }
    this.setState({ processList });
  }

  hookBpmnOnClick(e) {
    const { element } = e;
    this.renderBpmnProps(element);
  }

  hookBpmnEventBus() {
    const eventBus = this.bpmnAltModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookBpmnOnClick(e));
  }

  highlightOriginalProcess() {
    const process = ProcessQuery.getProcess(this.bpmnAltModeler);
    const flowNodes = ProcessQuery.getFlowNodesOfProcess(process);
    const graph = this.removeGraph;
    const violatedElements = GraphQuery.filterNodes(graph, { style: 'violated' });
    const obsoleteElements = GraphQuery.filterNodes(graph, { style: 'obsolete' });
    const changedElements = GraphQuery.filterNodes(graph, { style: 'changedElement' });

    for (let i = 0; i < flowNodes.length; i++) {
      const node = flowNodes[i];
      for (let j = 0; j < violatedElements.length; j++) {
        const violatedElement = violatedElements[j].data();
        if (node.name !== undefined) {
          if (node.name === violatedElement.display_name){
            const shape = ProcessQuery.getShapeOfRegistry(this.bpmnAltModeler, node.id);
            const isCompliance = ProcessQuery.isCompliance(node);
            if (isCompliance) {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'red', fill: 'grey' });
            } else {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'red' });
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
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'blue', fill: 'grey' });
            } else {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'blue' });
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
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'orange', fill: 'grey' });
            } else {
              ProcessRenderer.colorShape(this.bpmnAltModeler, shape, { stroke: 'orange' });
            }
          }
        }
      }
    }
  }

  pushOriginalToList(){
    const bpmnXml = FileIo.getXmlFromViewer(this.bpmnAltModeler);
    const entry = {
      name: 'original process',
      bpmnXml,
    };

    const list = [];
    list.push(entry);
    this.setState({ processList: list });
  }

  renderOriginalProcess = (xml) => {
    this.bpmnAltModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.bpmnAltModeler.get('canvas');
        canvas.zoom('fit-viewport');
        this.hookBpmnEventBus();
        this.highlightOriginalProcess();
        this.pushOriginalToList();
      }
    });
  };

  renderBpmn = (xml) => {
    this.bpmnAltModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.bpmnAltModeler.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  };

  selectProcess = (option) => {
    this.setState({ selectedProcess: option });
    this.renderBpmn(option.bpmnXml);
  };

  exportProcess = () => {
    const bpmnXml = this.state.selectedProcess.bpmnXml;
    ProjectIo.exportBpmn(bpmnXml);
  };

  renderBpmnProps(shape) {
    if (shape !== null) {
      const { businessObject } = shape;
      this.setState({ bpmnShape: shape });
      this.setState({ bpmnId: businessObject.id });
      this.setState({ bpmnName: businessObject.name });
      this.setState({ isCompliance: ProcessQuery.isCompliance(businessObject) });
      this.setState({ bpmnProps: ProcessQuery.getExtensionOfElement(businessObject) });
    } else {
      this.setState({ bpmnShape: null });
      this.setState({ bpmnId: null });
      this.setState({ bpmnName: null });
      this.setState({ isCompliance: false });
      this.setState({ bpmnProps: [] });
    }
  }

  renderAlternativePanel() {
    return (
      <div className="property-panel" id="alternative-panel">
        <ListBox
          style={{ width: '100%' }}
          value={this.state.selectedProcess}
          options={this.state.processList}
          optionLabel="name"
          onChange={e => this.selectProcess(e.value)}
        />
        <br />
        <Button
          label="export process"
          onClick={this.exportProcess}
        />
      </div>
    );
  }

  renderPropsPanel() {
    return (
      <div className="property-panel">
        <div>
          <label>ID: {this.state.bpmnId} </label>
        </div>
        <br />
        <div>
          <label>Name: {this.state.bpmnName} </label>
        </div>
        <br />
        <div>
          <ListBox
            options={this.state.bpmnProps}
            onChange={e => this.setState({ bpmnProp: e.value })}
            optionLabel="name"
            style={{ width: '100%' }}
          />
        </div>
        <br />
        <div>
          <Checkbox
            inputId="cb"
            checked={this.state.isCompliance}
          />
          <label htmlFor="cb">is Compliance Process </label>
        </div>
      </div>
    );
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
