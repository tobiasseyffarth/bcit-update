import React, {Component} from 'react';
import {Dialog} from 'primereact/dialog';
import {ListBox} from 'primereact/listbox';
import {Button} from 'primereact/button';
import {TabView, TabPanel} from 'primereact/tabview';
import {Growl} from 'primereact/growl';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import cytoscape from "cytoscape";
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
        {name: 'alternative 1'},
        {name: 'alternative 2'},
      ],
      visibleAnalyze: false
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
    this.setState({visibleAnalyze: false});
  }

  renderAnalyzeView() {
    this.setState({visibleAnalyze: true});
  }

  hookEventBus() {
    const eventBus = this.bpmnModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookOnClick(e));
  }

  hookOnClick(e) {
    const shape = e.element;
    const businessObject = shape.businessObject;
    const graph = ProjectModel.getGraph();
    let node = graph.getElementById(businessObject.id);

    const containerChange = document.getElementById('graph-container-change');
    let graphChange;
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
      this.setState({visibleAnalyze: true}, () => {
            this.renderDeleteGraph(graphDelete);
          }
      );
      console.log('violated cp', GraphQuery.getViolatedComplianceProcess(graphDelete));
    }

  }

  renderDeleteGraph(graph) {
    const container = document.getElementById('graph-container-delete');
    let graphDelete = cytoscape({
      container,
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
    GraphRenderer.styleEdgesAnalyzeGraph(graphDelete);
    GraphRenderer.styleNodesAnalyzeGraph(graphDelete);
    GraphRenderer.drawAnalyze(graphDelete);
    GraphRenderer.resizeGraph(graphDelete);
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

  renderAnalyzeDialog() {
    const footer = (
        <div>
          <Button label="close" onClick={this.onHide}/>
        </div>
    );

    return (
        <div className="content-section implementation">
          <Dialog header="Graph" footer={footer} visible={this.state.visibleAnalyze} style={{width: '80vw'}}
                  onHide={this.onHide} maximizable>
            <section className="container-graph">
              <div className="viewer" id="graph-container-delete"/>
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
            {this.renderAnalyzeDialog()}
            <div className="viewer">
              <div id="canvas"/>
            </div>
          </div>
        </div>
    );
  }
}

export default BpmnView;


// todo: wie kann auf ein Div in einem Tabpanel zugegriffen werden?
/*
 <div className="content-section implementation">
          <Dialog header="Analyze" footer={footer} visible={this.state.visibleAnalyze} style={{width: '80vw'}}
                  onHide={this.onHide} maximizable>
            <TabView>
              <TabPanel header="Change element">
                <section className="container-graph">
                  <div className="viewer" id="graph-container-change"/>
                  {this.renderGraphPropsPanel()}
                </section>
              </TabPanel>
              <TabPanel header="Delete element">
                <section className="container-graph">
                  <div className="viewer" id="graph-container-delete"/>
                  {this.renderGraphPropsPanel()}
                </section>
              </TabPanel>
              <TabPanel header="Alternatives">
                <section className="container-graph">
                  <div className="viewer" id="canvas-alternative"/>
                  {this.renderAlternativeSelector()}
                </section>
              </TabPanel>
            </TabView>
          </Dialog>
        </div>
 */