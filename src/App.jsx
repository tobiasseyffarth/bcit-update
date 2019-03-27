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

import TopMenu from './view/TopMenu';
import ConnectWizard from './view/2_connect/ConnectWizard';
import ImportModels from './view/1_import/ImportModels';


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
              <Link href="/" to="/import" className="logo">Import Models</Link>
                <Link href="/" to="/connect" className="logo">Connect Models</Link>
                <Link href="/" to="/alternatives" className="logo">Define Alternatives</Link>
                <Link href="/" to="/analyze" className="logo">Analyze Models</Link>
            </header>
            <div className="container content">
              <Route exact path="/import" component={ImportModels} />
              <Route path="/connect" component={ConnectWizard} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}
