import {Steps} from 'primereact/steps';
import {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types'; // ES6
import ProcIT from './ProcIT';
import ProcCompliance from './ProcCompliance';
import ComplianceCompliance from './ComplianceCompliance';
import ITCompliance from './ITCompliance';

export default class ConnectWizard extends Component {
    state = {
        // name: 'zeugnis',
    };

    items = [
        {label: 'Compliance/Compliance'},
        {label: 'Process/IT'},
        {label: 'Process/Compliance'},
        {label: 'IT/Compliance'},
    ];

    render() {
        return (
            <div>
                <Steps
                    model={this.items}
                    activeIndex={this.state.activeIndex}
                    readOnly={false}
                    onSelect={(e) => {
                        this.setState({activeIndex: e.index});
                        switch (e.index) {
                            case 0:
                                this.props.history.push('/connect/step1');
                                break;
                            case 1:
                                this.props.history.push('/connect/step2');
                                break;
                            case 2:
                                this.props.history.push('/connect/step3');
                                break;
                            case 3:
                                this.props.history.push('/connect/step4');
                                break;
                            default:
                                this.props.history.push('/connect');
                                break;
                        }
                    }}
                />
                <Switch>
                    <Redirect from="/connect" exact to="/connect/step1"/>
                    <Route path="/connect/step1" component={ComplianceCompliance}/>
                    <Route path="/connect/step2" component={ProcIT}/>
                    <Route path="/connect/step3" component={ProcCompliance}/>
                    <Route path="/connect/step4" component={ITCompliance}/>
                </Switch>
            </div>
        );
    }
}

ConnectWizard.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
    }).isRequired,
};
