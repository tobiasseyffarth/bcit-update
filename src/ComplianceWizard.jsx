import { Steps } from 'primereact/steps';
import { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'; // ES6
import ProcIT from './steps/ProcIT';
import ProcCompliance from './steps/ProcCompliance';

export default class TopMenu extends Component {
  state = {
    // name: 'zeugnis',
  };

  items = [
    { label: 'Process/IT' },
    // { label: 'Compliance/Compliance' },
    { label: 'Process/Compliance' },
    { label: 'IT/Compliance' },
    { label: 'Alternatives' },
    { label: 'Graph' },
    { label: 'Confirmation' },
  ];

  render() {
    return (
      <div>
        <Steps
          model={this.items}
          activeIndex={this.state.activeIndex}
          readOnly={false}
          onSelect={(e) => {
            this.setState({ activeIndex: e.index });
            switch (e.index) {
              case 0:
                this.props.history.push('/wizard/step1');
                break;
              case 1:
                this.props.history.push('/wizard/step2');
                break;
              default:
                this.props.history.push('/wizard');
                break;
            }
          }}
        />
        <Switch>
          <Redirect from="/wizard" exact to="/wizard/step1" />
          <Route path="/wizard/step1" component={ProcIT} />
          <Route path="/wizard/step2" component={ProcCompliance} />
        </Switch>
      </div>
    );
  }
}

TopMenu.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
