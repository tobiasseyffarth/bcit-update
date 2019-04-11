import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import PropTypes from 'prop-types';
import * as fileio from './../../controller/helpers/fileio';
import * as infraimporter from './../../controller/InfraImporter';
import * as complianceimporter from './../../controller/ComplianceImporter';
import bpmnXml from './../../models/processmodel';
import infraXml from './../../models/inframodel';
import complianceJson from './../../models/compliancemodel';
import ProjectModel from './../../models/ProjectModel';
import './../../App.css';

export default class ImportModels extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.openCompliance = this.openCompliance.bind(this);
    this.openInfra = this.openInfra.bind(this);
    this.openBPMN = this.openBPMN.bind(this);
    this.openModels();
  }

  async openCompliance() {
    const file = await fileio.getFile('.json, .xml');
    const input = await fileio.readFile(file);

    const compliance_import = complianceimporter.getJSON(input);
    const helper = ProjectModel.getCompliance();
    const compliance_add = complianceimporter.addCompliance({compliance: helper, imported_compliance: compliance_import})
    ProjectModel.setCompliance(compliance_add);

    this.growl.show({ severity: 'info', summary: 'Compliance successfull imported', detail: 'detail...' });
  }

  async openInfra() {
    const file = await fileio.getFile('.xml');
    const input = await fileio.readFile(file);
    const infra = infraimporter.getInfra(input);

    ProjectModel.setInfra(infra);
    this.growl.show({ severity: 'info', summary: 'Infra successfull imported', detail: 'detail...' });
  }

  async openBPMN() {
    const file = await fileio.getFile('.bpmn');
    const input = await fileio.readFile(file);
    ProjectModel.setBpmnXml(input);
    this.growl.show({ severity: 'info', summary: 'BPMN successfull imported', detail: 'detail...' });
  }

  openModels(){
    const infra = infraimporter.getInfra(infraXml);
    const compliance = complianceimporter.getJSON(complianceJson);

    ProjectModel.setBpmnXml(bpmnXml);
    ProjectModel.setInfra(infra);
    ProjectModel.setCompliance(compliance);
  }

  render() {
    return (
      <div>
        <Growl ref={(el) => { this.growl = el; }} position="topright" />
        <div>
          <br />
          <br />
          <Button
            className="button-import"
            label="Import Compliance"
            onClick={this.openCompliance}
            tooltip="open compliance file"
          />
          <br />
          <br />
          <Button
            className="button-import"
            label="Import BPMN"
            onClick={this.openBPMN}
            tooltip="open BPMN file"
          />
          <br />
          <br />
          <Button
            className="button-import"
            label="Import Infrastructure"
            tooltip="open archimate file"
            onClick={this.openInfra}
          />
        </div>
      </div>
    );
  }
}

ImportModels.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
