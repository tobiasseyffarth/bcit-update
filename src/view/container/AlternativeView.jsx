import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import BpmnViewer from 'bpmn-js';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development";

class AlternativeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alternativeProcess: [
        { name: 'alternative 1' },
        { name: 'alternative 2' },
      ],
    };
    this.renderAlternativeProcess = this.renderAlternativeProcess.bind(this);
  }


  componentDidMount() {
    this.bpmnAltModeler = new BpmnViewer({
      container: '#alternative',
      height: '350px',
    });

    this.onMount();
  }


  onMount() {
    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmn(ProjectModel.getBpmnXml());
    }
  }

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

  renderAlternativeProcess(option) {
    console.log(option);
  }

  render() {
    return (
      <section className="container-process">
        <div className="viewer" style={{ width: '60vw', height: '400px' }}>
          <div id="alternative" />
        </div>
        <div className="property-panel">
          <ListBox
            style={{ width: '100%' }}
            options={this.state.alternativeProcess}
            optionLabel="name"
            onChange={e => this.renderAlternativeProcess(e.value)}
          />
        </div>
      </section>
    );
  }
}

export default AlternativeView;
