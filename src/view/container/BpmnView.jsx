import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {ListBox} from 'primereact/listbox';
import {Button} from 'primereact/button';
import {TabView, TabPanel} from 'primereact/tabview';
import {Growl} from 'primereact/growl';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import cytoscape from "cytoscape";
import ProjectModel from '../../models/ProjectModel';
import AnalyzeView from './AnalyzeView';
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
        {name: 'alternative 1'},
        {name: 'alternative 2'},
      ],
      visibleRemove: false,
      visibleChange: false,
      visibleAlternative: false
    };

    this.onHide = this.onHide.bind(this);
  }

  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      height: '400px'
    });

    this.hookEventBus();

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderDiagram(ProjectModel.getBpmnXml());
    }
  }

  onHide() {
    this.setState({visibleRemove: false});
    this.setState({visibleChange: false});
  }

  hookEventBus() {
    const eventBus = this.bpmnModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookOnClick(e));
  }

  hookOnClick(e) {
    const pressCrtl = e.originalEvent.ctrlKey;

    if (pressCrtl){
      this.getChangeGraph(e)
    } else {
      this.getRemoveGraph(e)
    }
  }

  getRemoveGraph(e){
    const shape = e.element;
    const businessObject = shape.businessObject;
    const graph = ProjectModel.getGraph();
    let node = graph.getElementById(businessObject.id);
    let graphDelete = null;

    const isCP = ProcessQuery.isCompliance(businessObject);
    const isTaskOrSubprocess = ProcessQuery.isTaskOrSubprocess(shape);
    const isInfra = ProcessQuery.isDataStore(businessObject) && ProcessQuery.isExtensionShape(shape); //
    const isReq = ProcessQuery.isDataObject(businessObject) && ProcessQuery.isExtensionShape(shape); //

    if (isCP) {
      graphDelete = AnalyzeChange.getGraphDeleteComplianceProcess(graph, node);
    } else if (isTaskOrSubprocess) {
      graphDelete = AnalyzeChange.getGraphDeleteBusinessActivity(graph, node);
    } else if (isInfra) {
      const id = ProcessQuery.getIdFromExtensionShape(shape);
      node = graph.getElementById(id);
      graphDelete = AnalyzeChange.getGraphDeleteITComponent(graph, node);
    } else if (isReq) {
      const id = ProcessQuery.getIdFromExtensionShape(shape);
      node = graph.getElementById(id);
      graphDelete = AnalyzeChange.getGraphDeleteRequirement(graph, node);
    } else {
      this.growl.show({severity: 'warn', summary: 'Can not analyze element', detail: 'Can not analyze this element.'});
    }

    if (graphDelete !== null && graphDelete.nodes().length > 1){
      ProjectModel.setAnalyzeDelete(graphDelete);
      this.setState({visibleRemove: true}, () => {
            this.renderRemoveGraph(graphDelete);
          }
      );
      console.log('violated req', GraphQuery.filterNodes(graphDelete, {style:'violated', type:'compliance'}));
    }

    if (graphDelete !== null && graphDelete.nodes().length <= 1){
      const detail = 'no violations found';
      this.growl.show({severity: 'info', summary: 'No compliance violation', detail: detail});
    }
  }

  getChangeGraph(e){
    const shape = e.element;
    const businessObject = shape.businessObject;
    const graph = ProjectModel.getGraph();
    let node = graph.getElementById(businessObject.id);
    let graphChange = null;

    const isCP = ProcessQuery.isCompliance(businessObject);
    const isTaskOrSubprocess = ProcessQuery.isTaskOrSubprocess(shape);
    const isInfra = ProcessQuery.isDataStore(businessObject) && ProcessQuery.isExtensionShape(shape); //
    const isReq = ProcessQuery.isDataObject(businessObject) && ProcessQuery.isExtensionShape(shape); //

    if (isCP) {
      graphChange = AnalyzeChange.getGraphReplaceComplianceProcess(graph, node);
    } else if (isTaskOrSubprocess) {
      graphChange = AnalyzeChange.getGraphReplaceBusinessActivity(graph, node);
    } else if (isInfra) {
      const id = ProcessQuery.getIdFromExtensionShape(shape);
      node = graph.getElementById(id);
      graphChange = AnalyzeChange.getGraphReplaceITComponent(graph, node);
    } else if (isReq) {
      const id = ProcessQuery.getIdFromExtensionShape(shape);
      node = graph.getElementById(id);
      graphChange = AnalyzeChange.getGraphReplaceRequirement(graph, node);
    } else {
      this.growl.show({severity: 'warn', summary: 'Can not analyze element', detail: 'Can not analyze this element.'});
    }

    if (graphChange !== null && graphChange.nodes().length > 1){
      this.setState({visibleChange: true}, () => {
            this.renderChangeGraph(graphChange);
          }
      );
    }

    if (graphChange !== null && graphChange.nodes().length <= 1){
      const detail = 'no demands found';
      this.growl.show({severity: 'info', summary: 'No compliance violation', detail: detail});
    }
  }

  renderRemoveGraph(graph) {
    const containerRemove = document.getElementById('graph-container-remove');
    let graphDelete = cytoscape({
      container: containerRemove,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'white',
            'border-style': 'solid',
            'border-color': 'black',
            'border-width': 1,
            'label': 'data(display_name)',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 20,
            'shape': 'rectangle'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#666',
            'mid-target-arrow-color': '#666',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });

    GraphRenderer.removeElements(graphDelete);
    GraphRenderer.copyGraphElements(graphDelete, graph);
    GraphRenderer.renderAnalyzeGraph(graphDelete);
  }

  renderChangeGraph(graph) {
    const containerChange = document.getElementById('graph-container-change');
    let graphChange = cytoscape({
      container: containerChange,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'white',
            'border-style': 'solid',
            'border-color': 'black',
            'border-width': 1,
            'label': 'data(display_name)',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 20,
            'shape': 'rectangle'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#666',
            'mid-target-arrow-color': '#666',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted'
          }
        }
      ],
      layout: {
        name: 'grid',
        rows: 1
      }
    });

    GraphRenderer.removeElements(graphChange);
    GraphRenderer.copyGraphElements(graphChange, graph);
    GraphRenderer.renderAnalyzeGraph(graphChange);
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
          <br/>
          <div>
            <label>Name: {this.state.nodeName}</label>
          </div>
          <br/>
          <div>
            <label>Node Type: {this.state.nodeType}</label>
          </div>
          <br/>
          <div>
            <label>Model Type: {this.state.modelType}</label>
          </div>
          <br/>
          <div>
            <ListBox
                style={{width: '100%'}}
                options={this.state.nodeProps}
                optionLabel="name"
            />
          </div>
        </div>
    );
  }

  renderAlternativeProcess(option) {
    console.log(option);
  }

  renderAlternativeSelector() {
    return (
        <div className="property-panel">
          <div>
            <ListBox
                style={{width: '100%'}}
                options={this.state.alternativeProcess}
                optionLabel="name"
                onChange={e => this.renderAlternativeProcess(e.value)}
            />
          </div>
        </div>
    );
  }

  renderRemoveDialog() {
    const footer = (
      <div>
        <Button label="show alternatives"/>
        <Button label="close" onClick={this.onHide}/>
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Graph Remove"
          footer={footer}
          visible={this.state.visibleRemove}
          style={{width: '80vw'}}
          onHide={this.onHide}
          maximizable>
            <section className="container-graph">
              <div className="viewer" id="graph-container-remove"/>
              {this.renderGraphPropsPanel()}
            </section>
        </Dialog>
      </div>
    );
  }

  renderChangeDialog() {
    const footer = (
        <div>
          <Button label="close" onClick={this.onHide}/>
        </div>
    );

    return (
        <div className="content-section implementation">
          <Dialog
              header="Graph Change"
              footer={footer}
              visible={this.state.visibleChange}
              style={{width: '80vw'}}
              onHide={this.onHide}
              maximizable>
            <section className="container-graph">
              <div className="viewer" id="graph-container-change"/>
              {this.renderGraphPropsPanel()}
            </section>
          </Dialog>
        </div>
    );
  }

  render() {
    return (
        <div>
          <Growl ref={(el) => {
            this.growl = el;
          }} position="topright"/>
          <div>
            {this.renderRemoveDialog()}
            {this.renderChangeDialog()}
            <div className="viewer">
              <div id="canvas"/>
            </div>
          </div>
        </div>
    );
  }
}

export default BpmnView;
