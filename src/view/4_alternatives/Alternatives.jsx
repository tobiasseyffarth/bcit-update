import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Growl } from 'primereact/growl';
import {InputText} from 'primereact/inputtext';
import PropTypes from 'prop-types';
import ProjectModel from '../../models/ProjectModel';
import * as GraphRenderer from "../../controller/graph/GraphRenderer";
import * as GraphEditor from "../../controller/graph/GraphEditor";

export default class Alternatives extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null,
      nodeProps: [],
      selectedCompliance: null,
      visibleComplianceProcessDialog: false,
      visibleComplianceProcessPatternDialog: false,
      processName: '',
      processRule: '',
      processProps: []
    };

    this.onHide= this.onHide.bind(this);
    this.addComplianceRequirement = this.addComplianceRequirement.bind(this);
    this.addComplianceProcess = this.addComplianceProcess.bind(this);
    this.addComplianceProcessPattern = this.addComplianceProcessPattern.bind(this);
    this.showComplianceProcessDialog = this.showComplianceProcessDialog.bind(this);
    this.showComplianceProcessPatternDialog = this.showComplianceProcessPatternDialog.bind(this);
    this.removeNode = this.removeNode.bind(this);
  }

  componentDidMount(){
    this.onMount();
  }

  componentWillUnmount(){
    ProjectModel.setAltGraph(this.graph);
  }

  onMount(){
    const container = document.getElementById('alt-graph-container');
    this.graph = ProjectModel.getAltGraph();

    if (this.graph === null){
      this.graph = GraphEditor.getEmptyGraph();
    }

    this.graph.mount(container);
    GraphRenderer.resizeGraph(this.graph);
    GraphRenderer.styleNodesAltGraph(this.graph);
    GraphRenderer.drawNodesAltGraph(this.graph);
    this.hookGraphOnClick(this.graph);
  }

  onHide() {
    this.setState({ visibleComplianceProcessDialog: false });
    this.setState({ visibleComplianceProcessPatternDialog: false });
  }

  hookGraphOnClick(graph){
    const _this = this;

    graph.on('click', (evt) => {
      const element = evt.target;
      if (element === graph) { // background
        _this.renderGraphProps(null);
      } else {
        if (element.isNode()) { // edge
          _this.renderGraphProps(element);
        }
      }
    });
  }

  renderGraphProps(node){
    if (node !== null) {
      this.setState({ nodeId: node.data('id') });
      this.setState({ nodeName: node.data('name') });
      this.setState({ nodeType: node.data('nodetype') });
      this.setState({ modelType: node.data('modeltype') });

      const nodeType = node.data('nodetype');
      if (nodeType !== 'compliance'){ // non compliance nodes
        this.setState({ nodeProps: node.data('props') });
      } else { // compliance nodes
        this.setState({ nodeProps: [] });
      }
    } else {
      this.setState({ nodeId: null });
      this.setState({ nodeName: null });
      this.setState({ nodeType: null });
      this.setState({ modelType: null });
      this.setState({ nodeProps: [] });
    }
  }

  linkNodes(graph, node, newNode){
    GraphEditor.linkNodesAltGraph(graph, node, newNode);
    GraphRenderer.styleNodesAltGraph(graph);
    GraphRenderer.drawNodesAltGraph(graph);
  }

  addComplianceRequirement(){
    const req = this.state.selectedCompliance;

    if (req !== null){
      const isUnique = GraphEditor.addNode(this.graph, { req: req });
      GraphRenderer.styleNodesAltGraph(this.graph);
      GraphRenderer.drawNodesAltGraph(this.graph);
      if (!isUnique){
        this.growl.show({
          severity: 'warn',
          summary: 'Compliance requirement already in the graph.',
          detail:'' });
      }
    } else {
      this.growl.show({
        severity: 'warn',
        summary: 'Please select an compliance requirement from the list.',
        detail:'' });
    }
  }

  addComplianceProcess() {
    const id = Date.now();
    const complianceProcess = {
      id: Date.now(),
      name: this.state.processName,
      rule: this.state.processRule,
    };
    const newNode = GraphEditor.addNode(this.graph, { complianceProcess: complianceProcess });
    const node = this.graph.getElementById(this.state.nodeId);
    this.linkNodes(this.graph, node, newNode);
    this.onHide();
  }

  addComplianceProcessPattern() {
    const id = Date.now();
    const comProcessPattern = {
      id: Date.now(),
      name: this.state.processName,
    };
    const newNode = GraphEditor.addNode(this.graph, { comProcessPattern: comProcessPattern });
    const node = this.graph.getElementById(this.state.nodeId);

    this.linkNodes(this.graph, node, newNode);
    this.onHide();
  }

  connectNodes() {

  }

  showComplianceProcessDialog() {
    const type = this.state.nodeType;

    if (type === null) {
      this.growl.show({
        severity: 'warn',
        summary: 'Please select an compliance requirement or compliance process pattern from the graph.',
        detail:'' });
    } else if (type === 'complianceprocess') {
      this.growl.show({
        severity: 'warn',
        summary: 'Compliance processes can only be connected to compliance requirements and compliance process patterns.',
        detail:'' });
    } else {
      this.setState({ visibleComplianceProcessDialog: true });
    }
  }

  showComplianceProcessPatternDialog() {
    const type = this.state.nodeType;

    if (type === null) {
      this.growl.show({
        severity: 'warn',
        summary: 'Please select an compliance requirement or a compliance process pattern from the graph.',
        detail:'' });
    } else if (type === 'complianceprocess') {
      this.growl.show({
        severity: 'warn',
        summary: 'Compliance process pattern can only be connected to compliance requirements and compliance process patterns.',
        detail:'' });
    } else {
      console.log('show pattern add');
      this.setState({ visibleComplianceProcessPatternDialog: true });
    }
  }

  selectCompliance(selectedRequirement) {
    this.setState({ selectedCompliance: selectedRequirement });
  }

  removeNode() {
    const id = this.state.nodeId;
    let node = this.graph.getElementById(id);

    if (node !== null){
      GraphEditor.removeNode(node);
      this.renderGraphProps(null);
    } else {
      this.growl.show({ severity: 'warn', summary: 'Please select a node from the graph.', detail:'' });
    }
  }

  renderComplianceProcessDialog() {
    const footer = (
      <div>
        <Button label="Add" onClick={this.addComplianceProcess} />
        <Button label="Abort" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Create new compliance process"
          footer={footer}
          visible={this.state.visibleComplianceProcessDialog}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          maximizable
        >
          <div>
            <label htmlFor="processName">Name</label>
            <InputText
              id="processName"
              value={this.state.processName}
              onChange={(e) => this.setState({processName: e.target.value})}/>
          </div>
          <div>
            <label htmlFor="processRule">Rule</label>
            <InputText
              id="processRule"
              value={this.state.processRule}
              onChange={(e) => this.setState({processRule: e.target.value})}/>
          </div>
        </Dialog>
      </div>
    );
  }

  renderComplianceProcessPatternDialog() {
    const footer = (
        <div>
          <Button label="Add" onClick={this.addComplianceProcessPattern} />
          <Button label="Abort" onClick={this.onHide} />
        </div>
    );

    return (
        <div className="content-section implementation">
          <Dialog
            header="Create new compliance process pattern"
            footer={footer}
            visible={this.state.visibleComplianceProcessPatternDialog}
            style={{ width: '80vw' }}
            onHide={this.onHide}
            maximizable
          >
            <div>
              <label htmlFor="processName">Name</label>
              <InputText
                id="processName"
                value={this.state.processName}
                onChange={(e) => this.setState({processName: e.target.value})}/>
            </div>
          </Dialog>
        </div>
    );
  }

  renderGraphPropsPanel() {
    return(
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
            label="remove node"
            onClick={this.removeNode} />
        </div>
      </div>
    )
  }

  renderGraphEditPanel() {
    const value = this.state.selectedCompliance;
    const compliance = ProjectModel.getCompliance();
    let option;
    if (compliance === null){
      option = [];
    } else{
      option = compliance.requirement;
    }

    return(
      <div className="property-panel">
        <div>
          <ListBox
            style={{ height: '98%', width: '98%' }}
            optionLabel="id"
            value={value}
            options={option}
            onChange={e => this.selectCompliance(e.value)}
            filter
          />
          <br />
          <Button
            label="add req"
            onClick={this.addComplianceRequirement} />
          <br />
          <br />
          <Button
            label="add pattern"
            onClick={this.showComplianceProcessPatternDialog} />
          <br />
          <br />
          <Button
            label="add compliance process"
            onClick={this.showComplianceProcessDialog} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Growl
            ref={(el) => {
              this.growl = el;
            }}
            position="topright"
        />
        <div>
          {this.renderComplianceProcessDialog()}
          {this.renderComplianceProcessPatternDialog()}
          <section className="container-graph">
            {this.renderGraphEditPanel()}
            <div className="viewer" id="alt-graph-container" />
            {this.renderGraphPropsPanel()}
          </section>
        </div>
      </div>
    );
  }
}

Alternatives.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
