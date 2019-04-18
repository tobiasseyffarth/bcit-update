import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import ProjectModel from '../../models/ProjectModel';
import * as ProcessQuery from '../../controller/process/ProcessQuery';

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
    const {element} = e;
    const isTaskOrSubprocess = ProcessQuery.isTaskOrSubprocess(element);

    if (isTaskOrSubprocess) {
      this.setState({bpmnShape: element});
      this.renderAnalyzeView();
    }
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

  renderAlternativeProcess(option){
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
        <Dialog header="Analyze" footer={footer} visible={this.state.visibleAnalyze} style={{width: '80vw'}}
                onHide={this.onHide} maximizable>
          <TabView>
            <TabPanel header="Remove element" contentStyle={{}}>
              <section className="container-graph">
                <div className="viewer" id="graph-container-remove"/>
                {this.renderGraphPropsPanel()}
              </section>
            </TabPanel>
            <TabPanel header="Delete element" contentStyle={{}}>
              <section className="container-graph">
                <div className="viewer" id="graph-container-delete"/>
                {this.renderGraphPropsPanel()}
              </section>
            </TabPanel>
            <TabPanel header="Alternatives" contentStyle={{}}>
              <section className="container-graph">
                <div className="viewer" id="canvas-alternative"/>
                {this.renderAlternativeSelector()}
              </section>
            </TabPanel>
          </TabView>
        </Dialog>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderAnalyzeDialog()}
        <div className="viewer">
          <div id="canvas"/>
        </div>
      </div>
    );
  }
}

export default BpmnView;
