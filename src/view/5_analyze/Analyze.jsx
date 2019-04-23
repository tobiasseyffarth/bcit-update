import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabView, TabPanel } from 'primereact/tabview';
import InfraView from '../container/InfraView';
import ComplianceView from '../container/ComplianceView';
import BpmnView from '../container/BpmnView';

export default class Analyze extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="content-section implementation">
          <TabView >
            <TabPanel header="View process model" >
              <section className="container-process">
                <BpmnView />
              </section>
            </TabPanel>
            <TabPanel header="View infrastructure model" >
              <section className="container-process">
                <InfraView />
              </section>
            </TabPanel>
            <TabPanel header="View compliance requirements" >
              <section className="container-process">
                <ComplianceView />
              </section>
            </TabPanel>
          </TabView>
        </div>
      </div>
    );
  }
}

Analyze.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
