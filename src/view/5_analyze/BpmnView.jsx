import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Growl } from 'primereact/growl';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import RemoveDialog from '../dialog/RemoveDialog';
import ChangeDialog from '../dialog/ChangeDialog';
import ProjectModel from '../../models/ProjectModel';
import * as ProcessQuery from '../../controller/process/ProcessQuery';
import * as AnalyzeChange from '../../controller/analyze/AnalyzeChange';
import * as GraphQuery from '../../controller/graph/GraphQuery';

class BpmnView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bpmnShape: null,
      bpmnId: null,
      bpmnName: null,
      isCompliance: false,
      visibleRemove: false,
      visibleChange: false,
    };

    this.onHide = this.onHide.bind(this);
    this.getChangeGraph = this.getChangeGraph.bind(this);
    this.getRemoveGraph = this.getRemoveGraph.bind(this);
  }

  componentDidMount() {
    this.setWith();

    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      height: '400px',
    });

    this.hookBpmnEventBus();

    if (ProjectModel.getBpmnXml() !== null) {
      this.renderDiagram(ProjectModel.getBpmnXml());
    }
  }

  setWith(){
    const bpmnProps = document.getElementById('bpmn-props-panel');
    const bpmnPropsWidth = bpmnProps.offsetWidth;
    const width = this.props.setWidth - bpmnPropsWidth - 50;
    this.setState({ width: width });
  }

  onHide() {
    this.setState({ visibleRemove: false });
    this.setState({ visibleChange: false });
  }

  getRemoveGraph(){
    const shape = this.state.bpmnShape;

    if (shape === null){
      this.growl.show({ severity: 'warn', summary: 'Please select an element.', detail: '' });
    } else {
      const graph = ProjectModel.getGraph();
      const deleteGraph = AnalyzeChange.getDeleteGraph({ shape }, graph);

      if (!deleteGraph) {
        this.growl.show({
          severity: 'warn',
          summary: 'Can not analyze element',
          detail: 'Can not analyze this element.',
        });
      } else {
        if (deleteGraph !== null && deleteGraph.nodes().length > 1) {
          ProjectModel.setRemoveGraph(deleteGraph);
          this.setState({ visibleRemove: true });
        }
        if (deleteGraph !== null && deleteGraph.nodes().length <= 1) {
          const detail = 'no violations found';
          this.growl.show({ severity: 'info', summary: 'No compliance violation', detail });
        }
      }
    }
  }

  getChangeGraph(){
    const shape = this.state.bpmnShape;

    if (shape === null) {
      this.growl.show({ severity: 'warn', summary: 'Please select an element.', detail: '' });
    } else {
      const graph = ProjectModel.getGraph();
      const changeGraph = AnalyzeChange.getChangeGraph({ shape }, graph);

      if (!changeGraph) {
        this.growl.show({
          severity: 'warn',
          summary: 'Can not analyze element',
          detail: 'Can not analyze this element.',
        });
      } else {
        if (changeGraph !== null && changeGraph.nodes().length > 1) {
          ProjectModel.setChangeGraph(changeGraph);
          this.setState({ visibleChange: true });
        }
        if (changeGraph !== null && changeGraph.nodes().length <= 1) {
          const detail = 'no demands found';
          this.growl.show({ severity: 'info', summary: 'No compliance violation', detail });
        }
      }
    }
  }

  hookBpmnOnClick(e) {
    this.renderBpmnProps(e.element);
  }

  hookBpmnEventBus() {
    const eventBus = this.bpmnModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookBpmnOnClick(e));
  }

  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  };

  renderBpmnPropsPanel() {
    return (
      <div className="property-panel" id="bpmn-props-panel">
        <div>
          <label>ID: {this.state.bpmnId} </label>
        </div>
        <br />
        <div>
          <label>Name: {this.state.bpmnName} </label>
        </div>
        <br />
        <div>
          <Checkbox
            inputId="cb"
            checked={this.state.isCompliance}
          />
          <label htmlFor="cb">is Compliance Process </label>
        </div>
        <br />
        <Button
          label="show result when remove"
          onClick={this.getRemoveGraph}
          tooltip="show compliance violation when removing these element"
        />
        <br />
        <br />
        <Button
          label="show result when change"
          onClick={this.getChangeGraph}
          tooltip="show demands by compliance requirements when changing these element"
        />
      </div>
    );
  }

  renderBpmnProps(shape){
    if (shape !== null) {
      const { businessObject } = shape;
      this.setState({ bpmnShape: shape });
      this.setState({ bpmnId: businessObject.id });
      this.setState({ bpmnName: businessObject.name });
      this.setState({ isCompliance: ProcessQuery.isCompliance(businessObject) });
    } else {
      this.setState({ bpmnShape: null });
      this.setState({ bpmnId: null });
      this.setState({ bpmnName: null });
      this.setState({ isCompliance: false });
    }
  }

  render() {
    return (
      <div>
        <Growl
          ref={(el) => {
          this.growl = el;
        }}
          position="topright"
        />
        <div>
          <RemoveDialog showRemoveDialog={this.state.visibleRemove} close={this.onHide} />
          <ChangeDialog showChangeDialog={this.state.visibleChange} close={this.onHide} />
          <section className="container-process">
            <div className="viewer" style={{ width: this.state.width }}>
              <div id="canvas" />
            </div>
            {this.renderBpmnPropsPanel()}
          </section>
        </div>
      </div>
    );
  }
}

export default BpmnView;
