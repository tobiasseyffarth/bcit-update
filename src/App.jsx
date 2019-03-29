import { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.css';
import 'mini.css';
import './App.css';

import TopMenu from './view/TopMenu';
import ConnectWizard from './view/Wizard';

export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <div>
            <TopMenu />
            <div className="container content">
              <Route path="/" component={ConnectWizard} />
            </div>
          </div>
        </Router>
      </div>
    );
  }
}
