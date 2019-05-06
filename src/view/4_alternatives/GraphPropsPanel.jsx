import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Growl } from 'primereact/growl';
import { InputText } from 'primereact/inputtext';
import PropTypes from 'prop-types';
import ProjectModel from '../../models/ProjectModel';
import * as GraphRenderer from '../../controller/graph/GraphRenderer';
import * as GraphEditor from '../../controller/graph/GraphEditor';

export default class GraphPropsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null,
      nodeProps: [],
    };

    this.removeNode = this.removeNode.bind(this);
    this.editNode = this.editNode.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ nodeId: nextProps.nodeId });
    this.setState({ nodeName: nextProps.nodeName });
    this.setState({ nodeType: nextProps.nodeType });
    this.setState({ modelType: nextProps.modelType });
  }

  removeNode() {
    this.props.removeNode(this.state.nodeId);
  }

  editNode(){

  }

  renderGraphPropsPanel() {
    return (
      <div className="property-panel">
        <div>
          <label>ID: {this.state.nodeId}</label>
        </div>
        <br />
        <div>
          <label>Name: {this.state.nodeName}</label>
        </div>
        <br />
        <div>
          <label>Node Type: {this.state.nodeType}</label>
        </div>
        <br />
        <div>
          <label>Model Type: {this.state.modelType}</label>
        </div>
        <br />
        <div>
          <ListBox
            style={{ width: '100%' }}
            options={this.state.nodeProps}
            optionLabel="name"
          />
        </div>
        <br />
        <div>
          <Button
            label="edit process"
            onClick={this.editNode}
          />
        </div>
        <br />
        <div>
          <Button
            label="remove node"
            onClick={this.removeNode}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderGraphPropsPanel()}
      </div>
    );
  }
}
