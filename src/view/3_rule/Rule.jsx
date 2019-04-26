import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProjectModel from "../../models/ProjectModel";
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development"; // ES6

export default class Rule extends Component {
  state = {
    // name: 'zeugnis',
  };

  componentDidMount(){
    this.bpmnModelerA = new BpmnModeler({
      container: '#canvasa',
      height: '350px',
    });

    this.bpmnModelerB = new BpmnModeler({
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
        // this.fitBpmnView();
      }
    });
  };

  renderBpmnB = (xml) => {
    this.bpmnModelerB.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        // this.fitBpmnView();
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
