import { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import * as processquery from '../../controller/processquery';
import ProjectModel from '../../models/ProjectModel';

export default class StepProcIT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bpmnId: '_id',
      bpmnName: '_name',
      infraId: '_id infra',
      infraName: '_name infra',
      bpmnProps:  [],
      infraProps: [],
      isCompliance: true,
    };

    this.renderBpmnProps = this.renderBpmnProps.bind(this);
    this.removeInfraProps = this.removeInfraProps.bind(this);
    this.removeBpmnProps = this.removeBpmnProps.bind(this);
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
    this.setState({ element });
    const process = ProjectModel.getProcess();
    console.log(element);
    this.renderBpmnProps(element);
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

  renderBpmnProps(element){
    const businessObject = element.businessObject;

    this.setState({bpmnId: businessObject.id});
    this.setState({bpmnName: businessObject.name});
    this.setState({isCompliance: processquery.isCompliance(businessObject)});
  }

  removeBpmnProps(){
    console.log('remove BPMN prop');
  }

  removeInfraProps(){
    console.log('remove infra prop');
  }

  renderBpmnPropsPanel(){
    return (
        <div className="property-panel">
          <div>
            <label>ID: {this.state.bpmnId}</label>
          </div>
          <div>
            <label>Name: {this.state.bpmnName}</label>
          </div>
          <div>
            <ListBox value={this.state.extension} options={this.state.bpmnProps} onChange={(e) => this.setState({ extension: e.value })} optionLabel="name" />
            <Button
                label="remove"
                onClick={this.removeBpmnProp}
                tooltip="remove property"
            />
          </div>
          <div>
            <Checkbox inputId="cb" onChange={e => this.setState({ isCompliance: e.checked })} checked={this.state.isCompliance} />
            <label htmlFor="cb" >is Compliance Process</label>
          </div>
        </div>
    )
  }

  renderInfraPropsPanel(){
    return(
        <div className="property-panel">
          <p>Infra Panel</p>
          <div>
            <label>ID: {this.state.infraId}</label>
          </div>
          <div>
            <label>Name: {this.state.infraName}</label>
          </div>
          <div>
            <ListBox value={this.state.extension} options={this.state.infraProps} onChange={(e) => this.setState({ extension: e.value })} optionLabel="name" />
            <Button
                label="remove"
                onClick={this.removeInfraProp}
                tooltip="remove property"
            />
          </div>
        </div>
    )
  }

  render() {
    return (
      <div>
        <section className="container-process" >
          <div className="viewer">
            <div id="canvas" />
          </div>
          {this.renderBpmnPropsPanel()}
        </section>
        <section className="container-infra" >
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
