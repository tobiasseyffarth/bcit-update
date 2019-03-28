import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
// import BpmnPanel from './BpmnPanel';

import ProjectModel from './../models/ProjectModel';
import processquery from './../controller/processquery';

class BpmnView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
    });
    this.hookEventBus();

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderDiagram(ProjectModel.getBpmnXml());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.bpmnXml !== this.props.bpmnXml) {
      this.renderDiagram(nextProps.bpmnXml);
    }
  }

  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        ProjectModel.setViewer(this.bpmnModeler);
        const process = processquery.getProcess(this.bpmnModeler);
        ProjectModel.setProcess(process);

        const canvas = this.bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport', 'auto');
      }
    });
  };

  hookEventBus() {
    const eventBus = this.bpmnModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookOnClick(e));
  }

  hookOnClick(e) {
    const element = e.element;
    this.setState({ element });
    const process = ProjectModel.getProcess();
    console.log(process);
  }

  render() {
    return (
      <div className="content">
        <div className="bpmn-viewer" id="canvas" />
      </div>
    );
  }
}

export default BpmnView;
