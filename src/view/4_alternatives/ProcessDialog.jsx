import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';
import '../../App.css';
import * as GraphQuery from './../../controller/graph/GraphQuery';
import ProjectModel from './../../models/ProjectModel';

class ProcessDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: 'Create new compliance process',
      mode: 'add',
      process: null,
      processName: null,
      processId: null,
      processRule: null,
      controlledEntity: [],
      selectedCE: [],
      furtherReq: [],
      selectedReq: [],
      complianceProcesses: [],
      selectedCP: null,
      visibleDialog: false,
    };

    this.onShow = this.onShow.bind(this);
    this.onHide = this.onHide.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
    this.selectComplianceProcess = this.selectComplianceProcess.bind(this);
    this.renderProps = this.renderProps.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ visibleDialog: nextProps.showComplianceProcessDialog });
    this.setState({ process: nextProps.process });
  }

  onHide() {
    this.setState({ process: null });
    this.setState({ processName: null });
    this.setState({ processRule: null });
    this.setState({ controlledEntity: [] });
    this.setState({ selectedCE: [] });
    this.setState({ furtherReq: [] });
    this.setState({ selectedReq: [] });
    this.setState({ visibleDialog: false });
    this.props.close();
  }

  onShow(){
    this.setState({ controlledEntity: this.getBusinessActivity() });
    this.setState({ furtherReq: this.getInfraElements() });
    this.setState({ complianceProcesses: this.getComplianceProcess() });

    const { process } = this.state;
    if (process !== undefined){
      this.setState({ processName: process.name });
      this.setState({ header: 'Edit compliance process' });
      this.setState({ mode: 'edit' });
      this.renderProps(process);
    }
  }

  getBusinessActivity = () => {
    const graph = ProjectModel.getGraph();
    const businessNodes = GraphQuery.filterNodes(graph, { type: 'businessprocess' });
    const result = [];

    for (let i = 0; i < businessNodes.length; i++){
      const node = businessNodes[i];
      if (node.data('name') !== undefined) {
        result.push({ name: node.data('name'), id: node.data('id') });
      }
    }
    return result;
  };

  getComplianceProcess = () => {
    const graph = ProjectModel.getGraph();
    const complianceNodes = GraphQuery.filterNodes(graph, { type: 'complianceprocess' });
    const result = [];

    for (let i = 0; i < complianceNodes.length; i++){
      const node = complianceNodes[i];
      result.push({ name: node.data('name'), id: node.data('id'), props: node.data('props') });
    }
    return result;
  };

  getInfraElements = () => {
    const graph = ProjectModel.getGraph();
    const infraNodes = GraphQuery.filterNodes(graph, { type: 'infra' });
    const result = [];

    for (let i = 0; i < infraNodes.length; i++){
      const node = infraNodes[i];
      if (node.data('name') !== undefined) {
        result.push({ name: node.data('name'), id: node.data('id') });
      }
    }
    return result;
  };

  getProps(){
    const ce = this.state.selectedCE;
    const req = this.state.selectedReq;
    const result = [];

    for (let i = 0; i < ce.length; i++){
      result.push({
        key: 'ce',
        value: ce[i].id,
        display: `Controlled Entity ${ce[i].name}`,
      });
    }

    for (let i = 0; i < req.length; i++){
      result.push({
        key: 'req',
        value: req[i].id,
        display: `Further Requirement ${req[i].name}`,
      });
    }
    return result;
  }

  createComplianceProcess(process){
    let complianceProcess;
    const props = this.getProps();

    if (process === undefined){
      complianceProcess = {
        name: this.state.processName,
        props,
        modeltype: 'complianceprocess',
        nodetype: 'complianceprocess',
      };
    } else {
      complianceProcess = process;
      complianceProcess.name = this.state.processName;
      complianceProcess.props = props;
    }
    return complianceProcess;
  }

  addComplianceProcess(){
    const comProcess = this.createComplianceProcess();
    this.props.addProcess(comProcess);
  }

  editComplianceProcess(){
    const comProcess = this.createComplianceProcess(this.state.process);
    this.props.edit(comProcess);
  }

  buttonClick(){
    const { mode } = this.state;
    if (mode === 'add'){
      this.addComplianceProcess();
    } else if (mode === 'edit'){
      this.editComplianceProcess();
    }
    this.onHide();
  }

  selectComplianceProcess(cp){
    this.setState({processId: cp.id});
    this.setState({processName: cp.name});
    this.renderProps(cp);
  }

  renderProps(process){
    const ce = this.getBusinessActivity();
    const req = this.getInfraElements();
    const { props } = process;
    let result = [];

    for (let i = 0; i < ce.length; i++){
      for (let j = 0; j < props.length; j++){
        const entity = ce[i];
        const prop = props[j];
        if (entity.id === prop.value){
          result.push(entity);
        }
      }
    }
    this.setState({ selectedCE: result });

    result = [];
    for (let i = 0; i < req.length; i++){
      for (let j = 0; j < props.length; j++){
        const entity = req[i];
        const prop = props[j];
        if (entity.id === prop.value || entity.id === prop._value){
          result.push(entity);
        }
      }
    }
    this.setState({ selectedReq: result });
  }

  render() {
    const footer = (
      <div>
        <Button label="Ok" onClick={this.buttonClick} />
        <Button label="Abort" onClick={this.onHide} />
      </div>
    );

    let complianceProcess;
    if (this.state.mode === 'add') {
      complianceProcess = (
        <div>
          <label htmlFor="complianceProcess">Select existing compliance process</label>
          <Dropdown
            style={{width: '30%'}}
            value={this.state.selectedCP}
            options={this.state.complianceProcesses}
            onChange={(e) => { this.selectComplianceProcess(e.value) }}
            optionLabel="name"
          />
        </div>
      );
    }

    return (
      <div className="content-section implementation">
        <Dialog
          header={this.state.header}
          footer={footer}
          visible={this.state.visibleDialog}
          style={{ width: '80vw' }}
          onShow={this.onShow}
          onHide={this.onHide}
          maximizable
        >
          {complianceProcess}
          <div>
            <label htmlFor="processName">Name</label>
            <InputText
              style={{ width: '30%' }}
              id="processName"
              value={this.state.processName}
              onChange={e => this.setState({ processName: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="processRule">Rule</label>
            <InputText
              style={{ width: '30%' }}
              id="processRule"
              value={this.state.processRule}
              onChange={e => this.setState({ processRule: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="controlledEntity">Controlled Entity</label>
            <MultiSelect
              style={{ width: '30%' }}
              optionLabel="name"
              value={this.state.selectedCE}
              options={this.state.controlledEntity}
              onChange={e => this.setState({ selectedCE: e.value })}
            />
          </div>
          <div>
            <label htmlFor="furtherReq">Further Requirements</label>
            <MultiSelect
              style={{ width: '30%' }}
              optionLabel="name"
              value={this.state.selectedReq}
              options={this.state.furtherReq}
              onChange={e => this.setState({ selectedReq: e.value })}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default ProcessDialog;
