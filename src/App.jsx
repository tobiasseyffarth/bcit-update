import { Component } from 'react';
// import PropTypes from 'prop-types'; // ES6
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.css';
import 'mini.css';
import './App.css';

import TopMenu from './TopMenu';
import ComplianceWizard from './ComplianceWizard';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

export default class App extends Component {
  state = {
    // name: 'zeugnis',
  };

  render() {
    return (
      <div>
        <Router>
          <div>
            <TopMenu />
            <header>
              <Link href="/" to="/" className="logo">Home</Link>
            </header>
            <div className="container content">
              <Route exact path="/" component={Home} />
              <Route path="/wizard" component={ComplianceWizard} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}
