import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';

import '../../App.css';

// import ProjectModel from './../models/ProjectModel';

class BpmnPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '_id',
      name: '_name',
      extension: null,
      isCompliance: false,
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.element !== this.props.element) {
      // this.setState({ id: nextProps.element.id });
      // console.log(nextProps.element);
    }
  }

  removeExtension(){

  }

  render() {

    const cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    return (
        <div className="property-panel">
          <div>
            <label>ID: {this.state.id}</label>
          </div>
          <div>
            <label>Name: {this.state.name}</label>
          </div>
          <div>
            <ListBox value={this.state.extension} options={cities} onChange={(e) => this.setState({extension: e.value})} optionLabel="name"/>
            <Button>
                label="-"
                onClick={this.removeExtension()}
                tooltip="remove extension"
            </Button>
          </div>
          <div>
            <Checkbox inputId="cb" onChange={e => this.setState({isCompliance: e.checked})} checked={this.state.isCompliance} />
            <label htmlFor="cb" >is Compliance Process</label>
          </div>
        </div>
    );
  }
}

export default BpmnPanel;
