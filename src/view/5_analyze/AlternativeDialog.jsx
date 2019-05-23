import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import * as AlternativeFinder from './../../controller/adapt/AlternativeFinder';

class AlternativeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alternativeProcess: [
        { name: 'alternative 1' },
        { name: 'alternative 2' },
      ],
      selectedProcess: null,
      visibleAlternative: false,
    };

    this.renderAlternativeProcess = this.renderAlternativeProcess.bind(this);
    this.exportProcess = this.exportProcess.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  componentDidMount() {
    this.bpmnAltModeler = new BpmnModeler({
      container: '#alternative',
      height: '350px',
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({ visibleAlternative: nextProps.showAlternative });
  }

  onHide() {
    this.props.close();
    this.setState({ visibleAlternative: false });
  }

  onShow() {
    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmn(ProjectModel.getBpmnXml());
    }

    if (ProjectModel.getRemoveGraph() !== null) {
      this.removeGraph = ProjectModel.getRemoveGraph();
    }

    if (ProjectModel.getAltGraph() !== null) {
      this.altGraph = ProjectModel.getAltGraph();
    }

    console.log(this.removeGraph);
    console.log(this.altGraph);

    AlternativeFinder.getAlternatives(this.altGraph, this.removeGraph);
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

  renderAlternativeProcess = (option) => {
    console.log('render', option);
    this.setState({ selectedProcess: option});
  };

  exportProcess = () => {
    console.log('export process', this.state.selectedProcess);
  };

  renderAlternativePanel(){
    return (
      <div className="property-panel">
        <ListBox
          style={{ width: '100%' }}
          value={this.state.selectedProcess}
          options={this.state.alternativeProcess}
          optionLabel="name"
          onChange={(e) => this.renderAlternativeProcess(e.value)}
        />
        <br />
        <Button
          label="export process"
          onClick={this.exportProcess}
        />
      </div>
    )
  }

  renderPropsPanel(){
    return (
      <div className="property-panel">
        <ListBox
          style={{ width: '100%' }}
        />
      </div>
    )
  }

  render() {
    return (
      <div className="content-section implementation">
        <Dialog
          header="Alternative Processes"
          visible={this.state.visibleAlternative}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          onShow={() => this.onShow()}
          maximizable
        >
          <section className="container-process">
            {this.renderAlternativePanel()}
            <div className="viewer" style={{ width: '60vw', height: '400px' }}>
              <div id="alternative" />
            </div>
            {this.renderPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
  }
}

export default AlternativeDialog;
