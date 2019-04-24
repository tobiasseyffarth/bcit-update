import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabView, TabPanel } from 'primereact/tabview';
import InfraView from '../container/InfraView';
import ComplianceView from '../container/ComplianceView';
import BpmnView from '../container/BpmnView';

export default class Analyze extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabWidth: 0,
    };
  }

  componentDidMount(){
    this.onMount();
  }

  onMount(){
    const tabPanel = document.getElementById('tab-container');
    this.setState({ tabWidth: tabPanel.offsetWidth });
  }

  render() {
    return (
      <div>
        <div className="content-section implementation">
          <TabView >
            <TabPanel header="View process model" id="tabPanel">
              <section className="container-process" id="tab-container">
                <BpmnView />
              </section>
            </TabPanel>
            <TabPanel header="View infrastructure model" >
              <InfraView setWidth={this.state.tabWidth} />
            </TabPanel>
            <TabPanel header="View compliance requirements" >
              <ComplianceView />
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
