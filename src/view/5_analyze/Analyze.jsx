import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { TabView, TabPanel } from 'primereact/tabview';
import InfraView from '../container/InfraView';
import ComplianceView from '../container/ComplianceView';
import BpmnView from '../container/BpmnView';

export default class Analyze extends Component {
  state = {
    // name: 'zeugnis',
  };

  render() {
    return (
      <div>
        <div className="content-section implementation">
          <TabView>
            <TabPanel header="View process model" leftIcon="pi pi-calendar" contentStyle={{}}>
              <section className="container-process">
                <BpmnView />
              </section>
            </TabPanel>
            <TabPanel header="View infrastructure model" leftIcon="pi pi-calendar" contentStyle={{}}>
              <section className="container-process">
                <InfraView />
              </section>
            </TabPanel>
            <TabPanel header="View compliance requirements" leftIcon="pi pi-calendar" contentStyle={{}}>
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
