import { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import * as processquery from '../../controller/processquery';
import * as editprocess from '../../controller/editprocess';
import * as renderprocess from '../../controller/renderprocess';
import ProjectModel from '../../models/ProjectModel';

export default class StepProcIT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bpmnId: null,
      bpmnName: null,
      bpmnProps: [],
      selectedBpmnProp: null,
      selectedBpmnElement: null,
      isCompliance: false,
      infraId: null,
      infraName: null,
      infraProps: [],
      selectedInfraProp: null,
    };

    this.renderBpmnProps = this.renderBpmnProps.bind(this);
    this.removeInfraProp = this.removeInfraProp.bind(this);
    this.removeBpmnProp = this.removeBpmnProp.bind(this);
    this.setComplianceProcess = this.setComplianceProcess.bind(this);
    this.showBpmnModeler = this.showBpmnModeler.bind(this);
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
    if (processquery.isTaskOrSubprocess(element)) {
      this.renderBpmnProps(element);
      this.setState({ selectedBpmnElement: element });
    } else {
      this.renderBpmnProps(null);
      this.setState({ selectedBpmnElement: null });
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

  renderBpmnProps(element) {
    if (element !== null) {
      const businessObject = element.businessObject;

      this.setState({ bpmnId: businessObject.id });
      this.setState({ bpmnName: businessObject.name });
      this.setState({ isCompliance: processquery.isCompliance(businessObject) });
      this.setState({ bpmnProps: processquery.getExtensionOfElement(businessObject) });
    } else {
      this.setState({ bpmnId: null });
      this.setState({ bpmnName: null });
      this.setState({ isCompliance: false });
      this.setState({ bpmnProps: [] });
    }
  }

  removeBpmnProp() {
    if (this.state.selectedBpmnElement !== null) {
      const element = this.state.selectedBpmnElement;
      const businessObject = element.businessObject;
      editprocess.removeExt(businessObject.extensionElements, {
        name: this.state.selectedBpmnProp._name,
        value: this.state.selectedBpmnProp._value,
      });
      this.setState({ selectedBpmnElement: element }, () => {
        this.renderBpmnProps(element);
        renderprocess.renderComplianceProcess(this.bpmnModeler, element, processquery.isCompliance(businessObject));
      },
      );

      // todo Graph anpassen

      ProjectModel.setViewer(this.bpmnModeler);
    }
  }

  setComplianceProcess(e) {
    if (this.state.selectedBpmnElement !== null) {
      const modeler = this.bpmnModeler;
      const element = this.state.selectedBpmnElement;
      const businessObject = element.businessObject;

      if (e.checked) {
        this.setState({ isCompliance: true }, () => this.renderBpmnProps(element));
        editprocess.defineAsComplianceProcess(modeler, businessObject, true);
        renderprocess.renderComplianceProcess(modeler, element, true);
      } else {
        this.setState({ isCompliance: false }, () => this.renderBpmnProps(element));
        editprocess.defineAsComplianceProcess(modeler, businessObject, false);
        renderprocess.renderComplianceProcess(modeler, element, false);
      }

      // todo: Graph anpassen
    }
  }

  showBpmnModeler() {
    console.log(this.bpmnModeler.get('elementRegistry'));
  }

  removeInfraProp() {
    console.log('remove infra prop');

    // todo: Graph anpassen
  }

  renderBpmnPropsPanel() {
    return (
      <div className="property-panel">
        <div>
          <label>ID: {this.state.bpmnId} </label>
        </div>
        <div>
          <label>Name: {this.state.bpmnName} </label>
        </div>
        <div>
          <ListBox
            options={this.state.bpmnProps}
            onChange={e => this.setState({ selectedBpmnProp: e.value })}
            optionLabel="name"
          />
          <Button
            label="remove"
            onClick={this.removeBpmnProp}
            tooltip="remove property"
          />
          <Button
            label="xml"
            onClick={this.showBpmnModeler}
            tooltip="show Bpmn Modeler"
          />
        </div>
        <div>
          <Checkbox
            inputId="cb"
            onChange={e => this.setComplianceProcess(e)}
            checked={this.state.isCompliance}
          />
          <label htmlFor="cb">is Compliance Process </label>
        </div>
      </div>
    );
  }

  renderInfraPropsPanel() {
    return (
      <div className="property-panel">
        <p>Infra Panel</p>
        <div>
          <label>ID: {this.state.infraId}</label>
        </div>
        <div>
          <label>Name: {this.state.infraName}</label>
        </div>
        <div>
          <ListBox
            options={this.state.infraProps}
            onChange={e => this.setState({ selectedInfraProp: e.value })}
            optionLabel="name"
          />
          <Button
            label="remove"
            onClick={this.removeInfraProp}
            tooltip="remove property"
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <section className="container-process">
          <div className="viewer">
            <div id="canvas" />
          </div>
          {this.renderBpmnPropsPanel()}
        </section>
        <section className="container-infra">
          <div className="viewer">
            <p>Infra View</p>
          </div>
          {this.renderInfraPropsPanel()}
        </section>
      </div>
    );
  }
}

StepProcIT.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
