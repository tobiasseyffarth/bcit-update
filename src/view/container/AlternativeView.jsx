import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import BpmnViewer from 'bpmn-js';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';

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
    this.onMount();
  }

  onMount() {
    if (ProjectModel.getBpmnXml() !== null) {
      this.viewer = new BpmnViewer({ container: '#alternative' });
      // console.log(this.viewer);
      this.renderDiagram(ProjectModel.getBpmnXml());
    }
  }

  renderDiagram = (xml) => {
    this.viewer.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.viewer.get('canvas');
        // console.log('canvas', canvas);
        // canvas.zoom('fit-viewport'); // todo den aktiven Viewer finden, oder wie 2 viewer auf einer Seite anzeigen?
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
