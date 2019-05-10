import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import ProcessDialog from './ProcessDialog';
import ProcessPatternDialog from './ProcessPatternDialog';

export default class GraphPropsPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: null,
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null,
      nodeProps: [],
      visibleComplianceDialog: false,
      visibleComplianceProcessDialog: false,
      visibleComplianceProcessPatternDialog: false,
    };

    this.closeDialogs = this.closeDialogs.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.editNode = this.editNode.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ nodeId: nextProps.nodeId });
    this.setState({ nodeName: nextProps.nodeName });
    this.setState({ nodeType: nextProps.nodeType });
    this.setState({ modelType: nextProps.modelType });
    this.setState({ nodeProps: nextProps.nodeProps });
  }

  removeNode() {
    this.props.removeNode(this.state.nodeId);
  }

  closeDialogs(){
    this.setState({ visibleComplianceProcessDialog: false });
    this.setState({ visibleComplianceProcessPatternDialog: false });
  }

  openDialog(){
    const modelType = this.state.modelType;
    const node = {
      id: this.state.nodeId,
      name: this.state.nodeName,
      nodeType: this.state.nodeType,
      modelType: this.state.modelType,
      props: this.state.nodeProps
    };

    this.setState({ node: node });

    if (modelType === 'complianceprocesspattern'){
      this.setState({ visibleComplianceProcessPatternDialog: true });
    } else if (modelType === 'complianceprocess'){
      this.setState({ visibleComplianceProcessDialog: true });
    } else if (modelType === 'compliance') {
      this.setState({ visibleComplianceDialog: true });
    }
  }

  editNode(node){
    this.props.editNode(node);
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
            optionLabel="display"
          />
        </div>
        <br />
        <div>
          <Button
            label="edit"
            onClick={this.openDialog}
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
        <ProcessPatternDialog
          showCpPatternDialog={this.state.visibleComplianceProcessPatternDialog}
          pattern={this.state.node}
          edit={this.editNode}
          close={this.closeDialogs}
        />
        <ProcessDialog
          showComplianceProcessDialog={this.state.visibleComplianceProcessDialog}
          process={this.state.node}
          edit={this.editNode}
          close={this.closeDialogs}
        />
        <div>
          {this.renderGraphPropsPanel()}
        </div>
      </div>
    );
  }
}
