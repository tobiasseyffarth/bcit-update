import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import { InputTextarea } from 'primereact/inputtextarea';
import PropTypes from 'prop-types';
import ProjectModel from "../../models/ProjectModel"; // ES6
import * as ComplianceQuery from './../../controller/compliance/ComplianceQuery'
// import ProjectModel from '../../models/ProjectModel';

export default class StepComplianceCompliance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliance: [],
      filterOne: null,
      filterTwo: null,
      complianceFilterOne: [],
      complianceFilterTwo: [],
      complianceTextOne: '',
      complianceTextTwo: '',
      selectedComplianceOne: null,
      selectedComplianceTwo: null,
    };

    this.connectCompliance = this.connectCompliance.bind(this);
  }

  componentDidMount(){
    if (ProjectModel.getCompliance() !== null) {
      const compliance = ProjectModel.getCompliance();
      this.setState({ compliance });
      this.setState({complianceFilterOne: compliance});
      this.setState({complianceFilterTwo: compliance});
    }
  }

  filterCompliance(no, searchString){

    const compliance = this.state.compliance.requirement;
    let filter = ComplianceQuery.getRequirementContainsText(compliance, searchString);

    if (no === 1 ){
      this.setState({complianceFilterOne: filter});
    } else if (no === 2) {
      this.setState({complianceFilterTwo: filter});
    }
    console.log(filter);
  }

  selectCompliance(no, selectedRequirement){
    const compliance = this.state.compliance.requirement;
    const id = selectedRequirement.id;
    const reqText = ComplianceQuery.toString(compliance, id);

    if (no === 1) {
      this.setState({complianceTextOne: reqText});
      this.setState({selectedComplianceOne: selectedRequirement});
    } else if (no === 2) {
      this.setState({complianceTextTwo: reqText});
      this.setState({selectedComplianceTwo: selectedRequirement});
    }
  }

  connectCompliance(){
    console.log('compliance 1', this.state.selectedComplianceOne);
    console.log('compliance 2', this.state.selectedComplianceTwo);
  }


  renderComplianceSelectorOne(no){
    let option = this.state.complianceFilterOne.requirement;
    let value = this.state.selectedComplianceOne;

    return (
      <div>
        <section className="container-compliance">
          <div className="compliance-view-selector">
            <ListBox style={{width: '98%'}} optionLabel="id" value={value} options={option}  onChange={(e) => this.selectCompliance(no, e.value)} filter={true}/>
          </div>
          <div className="compliance-view-text">
            <InputTextarea style={{width: '100%', height:'98%'}} cols={60} value={this.state.complianceTextOne} autoResize={false} />
          </div>
        </section>
      </div>
    );
  }

  renderComplianceSelectorTwo(no){
    let option = this.state.complianceFilterTwo.requirement;
    let value = this.state.selectedComplianceTwo;

    return (
      <div>
        <section className="container-compliance">
          <div className="compliance-view-selector">
            <ListBox style={{width: '98%'}} optionLabel="id" value={value} options={option} onChange={(e) => this.selectCompliance(no, e.value)} filter={true}/>
          </div>
          <div className="compliance-view-text">
            <InputTextarea style={{width: '100%', height:'98%'}} cols={60} value={this.state.complianceTextTwo} autoResize={false} />
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
