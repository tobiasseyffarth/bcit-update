import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import '../../App.css';
import ProjectModel from "../../models/ProjectModel";
import * as ProcessQuery from "../../controller/process/ProcessQuery";

class AlternativeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alternativeProcess: [
        {name: 'alternative 1'},
        {name: 'alternative 2'},
        ]
      };
    this.renderAlternativeProcess = this.renderAlternativeProcess.bind(this);
  }

  componentDidMount() {
    this.onMount();
  }

  onMount() {
    if (ProjectModel.getBpmnXml() !== null) {
      this.renderDiagram(ProjectModel.getBpmnXml());
    }
  }

  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const process = ProcessQuery.getProcess(this.bpmnModeler);
        const canvas = this.bpmnModeler.get('alternative-process');
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
        <div className="viewer" style={{width:'100%'}} id="alternative-process" />
        <div className="property-panel">
          <ListBox
            style={{width: '100%'}}
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
