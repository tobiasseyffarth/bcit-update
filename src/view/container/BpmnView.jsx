import React, { Component } from 'react';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import ProjectModel from '../../models/ProjectModel';
import * as processquery from '../../controller/processquery';
import BpmnPanel from './BpmnPanel';

class BpmnView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      height: '350px',
    });

    this.hookEventBus();

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderDiagram(ProjectModel.getBpmnXml());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.view !== this.props.view) {
      console.log('bhjbdhs');
    }
  }

  hookEventBus() {
    const eventBus = this.bpmnModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookOnClick(e));
  }

  hookOnClick(e) {
    const { element } = e;
    this.setState({ element });
    const process = ProjectModel.getProcess();

    console.log(process);

    if (this.props.view === 'connectProcessInfra') {
      // BpmnPanel.props.element = element;
    } else if (this.props.view === 'connectProcessCompliance') {
      console.log(element.businessObject);
    } else if (this.props.view === 'analyzeProcess') {
      console.log('analyze process', element);
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
        canvas.zoom('fit-viewport');
      }
    });
  };

  render() {
    return (
      <div className="viewer">
        <div id="canvas" />
      </div>
    );
  }
}

export default BpmnView;
