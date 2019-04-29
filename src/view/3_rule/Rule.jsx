import React, { Component } from 'react';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import ProjectModel from '../../models/ProjectModel';
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development";
import BpmnViewer from 'bpmn-js/dist/bpmn-viewer.development';
import * as ProcessQuery from '../../controller/process/ProcessQuery';
import * as ProcessRenderer from './../../controller/process/ProcessRenderer';

export default class Rule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedShape: null,
    };
    this.removeShape = this.removeShape.bind(this);
    this.insertShape = this.insertShape.bind(this);
  }

  componentDidMount(){
    this.bpmnModelerA = new BpmnModeler ({
      container: '#canvasa',
      height: '350px',
    });

    this.bpmnModelerB = new BpmnViewer({
      container: '#canvasb',
      height: '350px',
    });

    this.onMount();
    this.hookBpmnEventBus();
  }

  onMount(){
    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmnA(ProjectModel.getBpmnXml());
    }

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmnB(ProjectModel.getBpmnXml());
    }
  }

  hookBpmnOnClick(e) {
    const { element } = e;
    if (ProcessQuery.isTaskOrSubprocess(element)) {
      this.renderBpmnProps(element);
      this.setState({ bpmnShape: element });
    } else {
      this.renderBpmnProps(null);
      this.setState({ bpmnShape: null });
    }
  }

  hookBpmnEventBus() {
    const eventBus = this.bpmnModelerA.get('eventBus');
    eventBus.on('element.click', e => this.hookBpmnOnClick(e));
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

  renderBpmnProps(shape) {
    if (shape !== null) {
      const { businessObject } = shape;

      this.setState({ bpmnId: businessObject.id });
      this.setState({ bpmnName: businessObject.name });
      this.setState({ selectedShape: shape });
    } else {
      this.setState({ bpmnId: null });
      this.setState({ bpmnName: null });
      this.setState({ selectedShape: null });
    }
  }

  removeShape(){
    if (this.state.selectedShape !== null){
      console.log('remove shape');
      ProcessRenderer.removeShape(this.bpmnModelerA, this.state.selectedShape);

      //todo: alle Nachfolger in der Position verschieben

    }

  }

  insertShape(){
    if (this.state.selectedShape !== null) {
      console.log('insert shape');

      let activity = ProcessRenderer.createShape(this.bpmnModelerA, {posX: 50, posY: 50, type: 'bpmn:Task', name:'do something'});
      console.log(activity);

      //todo: alle Nachfolger in der Position verschieben
    }
  }

  render() {
    return (
      <div>
        <section className="container-process">
          <div className="viewer">
            <div id="canvasa" />
          </div>
          <div className="property-panel">
            <div>
              <label>ID: {this.state.bpmnId} </label>
            </div>
            <br />
            <div>
              <label>Name: {this.state.bpmnName} </label>
            </div>
            <br />
            <Button
                label="remove"
                onClick={this.removeShape}
            />
            <br />
            <br />
            <Button
                label="insert"
                onClick={this.insertShape}
            />
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
