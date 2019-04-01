import { Component } from 'react';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import PropTypes from 'prop-types';
import * as fileio from './../../controller/helpers/fileio';

import ProjectModel from './../../models/ProjectModel';

export default class ImportModels extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.openCompliance = this.openCompliance.bind(this);
    this.openInfra = this.openInfra.bind(this);
    this.openBPMN = this.openBPMN.bind(this);
  }

  openCompliance() {
    this.growl.show({ severity: 'info', summary: 'Compliance successfull imported', detail: 'detail...' });
  }

  openInfra() {
    this.growl.show({ severity: 'info', summary: 'Infra successfull imported', detail: 'detail...' });
  }

  async openBPMN() {
    const file = await fileio.getFile();
    const input = await fileio.readFile(file);
    ProjectModel.setBpmnXml(input);
    this.growl.show({ severity: 'info', summary: 'BPMN successfull imported', detail: 'detail...' });
  }

  render() {
    return (
      <div>
        <Growl ref={(el) => { this.growl = el; }} position="topright" />
        <div>
          <br />
          <br />
          <Button
            label="Import Compliance"
            onClick={this.openCompliance}
            tooltip="open compliance file"
          />
          <br />
          <br />
          <Button
            label="Import BPMN"
            onClick={this.openBPMN}
            tooltip="open BPMN file"
          />
          <br />
          <br />
          <Button
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
