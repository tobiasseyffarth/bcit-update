import { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import cytoscape from 'cytoscape';
import * as ProcessQuery from '../../controller/process/ProcessQuery';
import * as ProcessEditor from '../../controller/process/ProcessEditor';
import * as ProcessRenderer from '../../controller/process/ProcessRenderer';
import * as GraphCreator from '../../controller/graph/GraphEditor';
import * as GraphRenderer from '../../controller/graph/GraphRenderer';
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
      infraGraph: null,
      selectedInfraProp: null,
      selectedInfraElement: null,
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
      this.renderBpmn(ProjectModel.getBpmnXml());
    }

    if (ProjectModel.getInfra() !== null) {
      this.renderInfra(ProjectModel.getInfra());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.view !== this.props.view) {
      console.log('bhjbdhs');
    }
  }

  renderBpmn = (xml) => {
    this.bpmnModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        ProjectModel.setViewer(this.bpmnModeler);
        const process = ProcessQuery.getProcess(this.bpmnModeler);
        ProjectModel.setProcess(process);
        const canvas = this.bpmnModeler.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  };

  renderInfra(infra) {
    const container = document.getElementById('infra-container');
    let graph = cytoscape({
      container: container,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'label': 'data(display_name)',
            'shape': 'triangle',
            'background-color': '#ffffff',
            'border-style': 'solid',
            'border-color': '#666666',
            'border-width': 1
          }
        },

        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#1c2966',
            'mid-target-arrow-color': '#3040b7',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted'
          }
        }
      ],
    });

    GraphCreator.createGraphFromInfra(graph, infra);
    let layout = graph.layout({name: 'breadthfirst'}); //more options http://js.cytoscape.org/#layouts
    layout.run();
    // graph.autolock(false); //elements can not be moved by the user
    GraphRenderer.resizeGraph(graph);

    this.setState({infraGraph: graph});
  }

  renderBpmnProps(element) {
    if (element !== null) {
      const {businessObject} = element;

      this.setState({bpmnId: businessObject.id});
      this.setState({bpmnName: businessObject.name});
      this.setState({isCompliance: ProcessQuery.isCompliance(businessObject)});
      this.setState({bpmnProps: ProcessQuery.getExtensionOfElement(businessObject)});
    } else {
      this.setState({bpmnId: null});
      this.setState({bpmnName: null});
      this.setState({isCompliance: false});
      this.setState({bpmnProps: []});
    }
  }

  removeBpmnProp() {
    if (this.state.selectedBpmnElement !== null) {
      const element = this.state.selectedBpmnElement;
      const {businessObject} = element;

      ProcessEditor.removeExt(businessObject.extensionElements, {
        name: this.state.selectedBpmnProp._name,
        value: this.state.selectedBpmnProp._value,
      });
      this.setState({selectedBpmnElement: element}, () => {
            this.renderBpmnProps(element);
            const isCPP = ProcessQuery.isCompliance(businessObject);
            ProcessRenderer.renderComplianceProcess(this.bpmnModeler, element, isCPP);
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
      const {businessObject} = element;

      if (e.checked) {
        this.setState({isCompliance: true}, () => this.renderBpmnProps(element));
        ProcessEditor.defineAsComplianceProcess(modeler, businessObject, true);
        ProcessRenderer.renderComplianceProcess(modeler, element, true);
      } else {
        this.setState({isCompliance: false}, () => this.renderBpmnProps(element));
        ProcessEditor.defineAsComplianceProcess(modeler, businessObject, false);
        ProcessRenderer.renderComplianceProcess(modeler, element, false);
      }
      ProjectModel.setViewer(this.bpmnModeler);
      // todo: Graph anpassen
    }
  }

  hookOnClick(e) {
    const {element} = e;
    if (ProcessQuery.isTaskOrSubprocess(element)) {
      this.renderBpmnProps(element);
      this.setState({selectedBpmnElement: element});
    } else {
      this.renderBpmnProps(null);
      this.setState({selectedBpmnElement: null});
    }
  }

  hookEventBus() {
    const eventBus = this.bpmnModeler.get('eventBus');
    eventBus.on('element.click', e => this.hookOnClick(e));
  }

  showBpmnModeler() {
    console.log(this.bpmnModeler.get('elementRegistry'));
  }

  removeInfraProp() {
    if (this.state.selectedInfraElement !== null) {
      console.log('remove infra prop');
    }

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
                onChange={e => this.setState({selectedBpmnProp: e.value})}
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
                onChange={e => this.setState({selectedInfraProp: e.value})}
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
              <div id="canvas"/>
            </div>
            {this.renderBpmnPropsPanel()}
          </section>
          <section className="container-infra">
            <div className="viewer" id="infra-container"/>
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
