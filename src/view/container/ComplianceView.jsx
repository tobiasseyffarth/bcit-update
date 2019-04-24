import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Growl } from 'primereact/growl';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import * as GraphQuery from '../../controller/graph/GraphQuery';
import * as ComplianceQuery from './../../controller/compliance/ComplianceQuery';

class ComplianceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliance: [], // whole compliance from ProjectModel
      complianceFilter: [], // compliance elements for ListBox
      complianceText: '', // Text for TextArea
      selectedCompliance: null, // selected element in the listbox
    };
  }

  componentDidMount() {
    this.filterCompliance();
  }

  filterCompliance(){
    const graph = ProjectModel.getGraph();
    const compliance = ProjectModel.getCompliance();
    const complianceNodes = GraphQuery.filterNodes(graph, {type: 'compliance'});
    let complianceFilter =[];

    for (let i = 0; i < complianceNodes.length; i++){
      const id = complianceNodes[i].data('id');
      const req = ComplianceQuery.getRequirementById(compliance.requirement, id);
      complianceFilter.push(req);
    }
    this.setState({complianceFilter: complianceFilter});
  }

  selectCompliance(selectedCompliance){
    const compliance = ProjectModel.getCompliance();
    const { id } = selectedCompliance;
    const reqText = ComplianceQuery.toString(compliance.requirement, id);
    this.setState({selectedCompliance: selectedCompliance});
    this.setState({complianceText: reqText});
  }

  renderComplianceSelector(){
    const option = this.state.complianceFilter;
    const value = this.state.selectedCompliance;

    return (
      <div className="viewer">
        <div>
          <section className="container-compliance">
            <div className="compliance-view-selector">
              <ListBox
                style={{ height: '98%', width: '98%' }}
                optionLabel="id"
                value={value}
                options={option}
                onChange={e => this.selectCompliance(e.value)}
                filter />
            </div>
            <div className="compliance-view-text">
              <InputTextarea
                readOnly
                style={{ width: '100%', height: '98%' }}
                cols={60}
                value={this.state.complianceText}
                autoResize={false} />
            </div>
          </section>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Growl ref={(el) => { this.growl = el; }} position="topright" />
        <div>
          <section className="container-compliance">
            {this.renderComplianceSelector()}
            <div className="property-panel">
              <Button
                label="show result when remove"

                tooltip="show compliance violation when removing these element"
              />
              <br />
              <br />
              <Button
                label="show result when change"

                tooltip="show demands by compliance requirements when changing these element"
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default ComplianceView;
