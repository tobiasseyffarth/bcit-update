import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProjectModel from "../../models/ProjectModel";
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development"; // ES6
import BpmnViewer from "bpmn-js/dist/bpmn-viewer.development";

export default class Rule extends Component {
  state = {
    // name: 'zeugnis',
  };

  componentDidMount(){
    this.bpmnModelerA = new BpmnViewer({
      container: '#canvasa',
      height: '350px',
    });

    this.bpmnModelerB = new BpmnViewer({
      container: '#canvasb',
      height: '350px',
    });

    this.onMount();
  }

  onMount(){
    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmnA(ProjectModel.getBpmnXml());
    }

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmnB(ProjectModel.getBpmnXml());
    }
  }

  renderBpmnA = (xml) => {
    this.bpmnModelerA.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.bpmnModelerA.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  };

  renderBpmnB = (xml) => {
    this.bpmnModelerB.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.bpmnModelerB.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  };

  render() {
    return (
      <div>
        <section className="container-process">
          <div className="viewer">
            <div id="canvasa" />
          </div>
        </section>
        <section className="container-process">
          <div className="viewer">
            <div id="canvasb" />
          </div>
        </section>
      </div>
    );
  }
}

Rule.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
