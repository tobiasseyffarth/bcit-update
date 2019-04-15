import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { InputTextarea } from 'primereact/inputtextarea';
import PropTypes from 'prop-types';
import ProjectModel from '../../models/ProjectModel'; // ES6
import * as ComplianceQuery from './../../controller/compliance/ComplianceQuery';
import * as GraphConnector from './../../controller/graph/GraphConnector';

export default class StepComplianceCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliance: [], // whole compliance from ProjectModel
      complianceFilterOne: [], // compliance elements for ListBox 1
      complianceFilterTwo: [],
      complianceTextOne: '', // Text for TextArea
      complianceTextTwo: '',
      selectedComplianceOne: null, // selected element in the listbox
      selectedComplianceTwo: null,
    };

    this.connectCompliance = this.connectCompliance.bind(this);
  }

  componentDidMount(){
    if (ProjectModel.getCompliance() !== null) {
      this.onMount();
    }
  }

  onMount(){
    const compliance = ProjectModel.getCompliance();
    this.setState({ compliance });
    this.setState({ complianceFilterOne: compliance });
    this.setState({ complianceFilterTwo: compliance });
  }

  selectCompliance(no, selectedRequirement){
    const compliance = this.state.compliance.requirement;
    const id = selectedRequirement.id;
    const reqText = ComplianceQuery.toString(compliance, id);

    if (no === 1) {
      this.setState({ complianceTextOne: reqText });
      this.setState({ selectedComplianceOne: selectedRequirement });
    } else if (no === 2) {
      this.setState({ complianceTextTwo: reqText });
      this.setState({ selectedComplianceTwo: selectedRequirement });
    }
  }

  connectCompliance(){
    const sourceReq = this.state.selectedComplianceOne;
    const targetReq = this.state.selectedComplianceTwo;

    if (sourceReq !== null && targetReq !== null){
      let graph = ProjectModel.getGraph();

      GraphConnector.linkRequirement2Requirement(graph, sourceReq, targetReq);
      ProjectModel.setGraph(graph);
    }
  }

  renderComplianceSelectorOne(no){
    const option = this.state.complianceFilterOne.requirement;
    const value = this.state.selectedComplianceOne;

    return (
      <div>
        <section className="container-compliance">
          <div className="compliance-view-selector">
            <ListBox style={{ height: '98%', width: '98%' }} optionLabel="id" value={value} options={option} onChange={e => this.selectCompliance(no, e.value)} filter />
          </div>
          <div className="compliance-view-text">
            <InputTextarea readOnly style={{ width: '100%', height: '98%' }} cols={60} value={this.state.complianceTextOne} autoResize={false} />
          </div>
        </section>
      </div>
    );
  }

  renderComplianceSelectorTwo(no){
    const option = this.state.complianceFilterTwo.requirement;
    const value = this.state.selectedComplianceTwo;

    return (
      <div>
        <section className="container-compliance">
          <div className="compliance-view-selector">
            <ListBox style={{ height: '98%', width: '98%' }} optionLabel="id" value={value} options={option} onChange={e => this.selectCompliance(no, e.value)} filter />
          </div>
          <div className="compliance-view-text">
            <InputTextarea readOnly style={{ width: '100%', height: '98%' }} cols={60} value={this.state.complianceTextTwo} autoResize={false} />
          </div>
        </section>
      </div>
    );
  }

  render() {
    return (
      <div>
        <section className="container-compliance">
          <div className="compliance-view">
            {this.renderComplianceSelectorOne(1)}
          </div>
          <div className="compliance-view">
            {this.renderComplianceSelectorTwo(2)}
          </div>
        </section>
        <Button
          label="connect"
          onClick={this.connectCompliance}
          tooltip="connect compliance requirements"
        />
      </div>
    );
  }
}

StepComplianceCompliance.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
