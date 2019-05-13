import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import PropTypes from 'prop-types';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';
import * as fileio from './../../controller/helpers/fileio';
import infraimporter from '../../controller/infra/InfraImporter';
import * as infraquery from '../../controller/infra/InfraQuery';
import * as complianceimporter from '../../controller/compliance/ComplianceImporter';
import * as GraphConnector from './../../controller/graph/GraphConnector';
import * as ProcessQuery from '../../controller/process/ProcessQuery';
import * as ProjectIO from '../../controller/helpers/projectio';
import bpmnXml from './../../models/processmodel';
import infraXml from './../../models/inframodel';
import complianceJson from '../../models/compliancemodel';
import altGraph from '../../models/altGraph';
import ProjectModel from './../../models/ProjectModel';
import './../../App.css';

export default class ImportModels extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.openCompliance = this.openCompliance.bind(this);
    this.openInfra = this.openInfra.bind(this);
    this.openBPMN = this.openBPMN.bind(this);
    this.openModels(); // temporary
  }

  async openCompliance() {
    const file = await fileio.getFile('.json, .xml');
    const input = await fileio.readFile(file);

    const complianceImport = complianceimporter.getJSON(input);
    const helper = ProjectModel.getCompliance();
    const complianceAdd = complianceimporter.addCompliance({ compliance: helper, imported_compliance: complianceImport });
    ProjectModel.setCompliance(complianceAdd);

    this.growl.show({ severity: 'info', summary: 'Compliance successfull imported', detail: 'detail...' });
  }

  async openInfra() {
    const file = await fileio.getFile('.xml');
    const input = await fileio.readFile(file);
    const result = infraimporter(input);

    if (result.infra !== undefined){
      ProjectModel.setInfra(result.infra);
      GraphConnector.addSubGraphs({ infra: result.infra }); // add infra to graph
      const metadata = infraquery.getMetadata(result.infra);
      this.growl.show({
        severity: 'info',
        summary: 'Infrastructure imported',
        detail: metadata.name,
      });
    } else {
      this.growl.show({
        severity: 'error',
        summary: 'Error importing infrastructure',
        detail: result.error.toString(),
      });
    }
  }

  async openBPMN() {
    const file = await fileio.getFile('.bpmn');
    const input = await fileio.readFile(file);
    ProjectModel.setBpmnXml(input);

    const bpmnModeler = new BpmnModeler({}); // create process object and add to graph

    bpmnModeler.importXML(input, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const process = ProcessQuery.getProcess(bpmnModeler);
        ProjectModel.setProcess(process);
        GraphConnector.addSubGraphs({ process });
      }
    });

    this.growl.show({ severity: 'info', summary: 'BPMN successfull imported', detail: 'detail...' });
  }

  // temporary
  openModels = () => {
    if (ProjectModel.getCompliance() === null){
      const compliance = complianceimporter.getJSON(complianceJson);
      ProjectModel.setCompliance(compliance);
    }

    if (ProjectModel.getInfra() === null){
      const infra = infraimporter(infraXml);
      ProjectModel.setInfra(infra.infra);
      GraphConnector.addSubGraphs({ infra: infra.infra });
    }

    if (ProjectModel.getBpmnXml() === null){
      const bpmnModeler = new BpmnModeler({});

      bpmnModeler.importXML(bpmnXml, (err) => { // create process object and add to graph
        if (err) {
          console.log('error rendering', err);
        } else {
          const process = ProcessQuery.getProcess(bpmnModeler);
          GraphConnector.addSubGraphs({ process });
          ProjectModel.setBpmnXml(bpmnXml);
        }
      });
    }

    if (ProjectModel.getAltGraph() === null){
      const elements = JSON.parse(altGraph);
      const graph = ProjectIO.getGraphFromElements(elements);
      ProjectModel.setAltGraph(graph);
    }
  };

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
