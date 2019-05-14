import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import ProcessDialog from './ProcessDialog';
import ProcessPatternDialog from './ProcessPatternDialog';
import ProjectModel from '../../models/ProjectModel';

export default class GraphEditPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeId: null,
      nodeType: null,
      selectedCompliance: null,
      visibleComplianceProcessDialog: false,
      visibleComplianceProcessPatternDialog: false,
    };

    this.closeDialogs = this.closeDialogs.bind(this);
    this.addProcess = this.addProcess.bind(this);
    this.addCpPattern = this.addCpPattern.bind(this);
    this.showReqDialog = this.showReqDialog.bind(this);
    this.showComplianceProcessDialog = this.showComplianceProcessDialog.bind(this);
    this.showComplianceProcessPatternDialog = this.showComplianceProcessPatternDialog.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ nodeId: nextProps.nodeId });
    this.setState({ nodeType: nextProps.nodeType });
  }

  closeDialogs(){
    this.setState({ visibleComplianceProcessDialog: false });
    this.setState({ visibleComplianceProcessPatternDialog: false });
  }

  addReq(req){
    this.props.addReq(req);
  }

  addProcess(process){
    this.props.addProcess(process);
  }

  addCpPattern(cpPattern){
    this.props.addCpPattern(cpPattern);
  }

  selectCompliance(selectedRequirement) {
    this.setState({ selectedCompliance: selectedRequirement });
  }

  showReqDialog(){
    const req = this.state.selectedCompliance;
    this.props.showReqDialog(req);
  }

  showComplianceProcessDialog() {
    const type = this.state.nodeType;

    if (type === null) {
      this.growl.show({
        severity: 'warn',
        summary: 'Please select an compliance requirement or compliance process pattern from the graph.',
        detail: '',
      });
    } else if (type === 'complianceprocess') {
      this.growl.show({
        severity: 'warn',
        summary: 'Compliance processes can only be connected to compliance requirements and compliance process patterns.',
        detail: '',
      });
    } else {
      this.setState({ visibleComplianceProcessDialog: true });
    }
  }

  showComplianceProcessPatternDialog() {
    const type = this.state.nodeType;

    if (type === null) {
      this.growl.show({
        severity: 'warn',
        summary: 'Please select an compliance requirement or a compliance process pattern from the graph.',
        detail: '',
      });
    } else if (type === 'complianceprocess') {
      this.growl.show({
        severity: 'warn',
        summary: 'Compliance process pattern can only be connected to compliance requirements and compliance process patterns.',
        detail: '',
      });
    } else {
      this.setState({ visibleComplianceProcessPatternDialog: true });
    }
  }

  renderGraphEditPanel() {
    const value = this.state.selectedCompliance;
    const compliance = ProjectModel.getCompliance();
    let option;
    if (compliance === null){
      option = [];
    } else {
      option = compliance.requirement;
    }

    return (
      <div className="property-panel">
        <div>
          <ListBox
            style={{ height: '98%', width: '98%' }}
            optionLabel="id"
            value={value}
            options={option}
            onChange={e => this.selectCompliance(e.value)}
            filter
          />
          <br />
          <Button
            label="add req"
            onClick={this.showReqDialog}
          />
          <br />
          <br />
          <Button
            label="add pattern"
            onClick={this.showComplianceProcessPatternDialog}
          />
          <br />
          <br />
          <Button
            label="add compliance process"
            onClick={this.showComplianceProcessDialog}
          />
        </div>
      </div>
    );
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
        <ProcessPatternDialog
          showCpPatternDialog={this.state.visibleComplianceProcessPatternDialog}
          close={this.closeDialogs}
          addCpProcess={this.addCpPattern}
        />
        <ProcessDialog
          showComplianceProcessDialog={this.state.visibleComplianceProcessDialog}
          close={this.closeDialogs}
          addProcess={this.addProcess}
        />
        <div>
          {this.renderGraphEditPanel()}
        </div>
      </div>
    );
  }
}
