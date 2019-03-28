import { Steps } from 'primereact/steps';
import { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import {TabView,TabPanel} from 'primereact/tabview';
import BpmnView from '../BpmnView';
import InfraView from '../InfraView';
import ComplianceView from '../ComplianceView';

export default class AnalyzeWizard extends Component {
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
                  <BpmnView view={'analyzeProcess'}/>
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

AnalyzeWizard.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
