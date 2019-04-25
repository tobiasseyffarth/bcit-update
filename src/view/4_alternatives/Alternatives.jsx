import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Growl } from 'primereact/growl';
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
    };

    this.addComplianceRequirement = this.addComplianceRequirement.bind(this);
    this.addComplianceProcess = this.addComplianceProcess.bind(this);
    this.addComplianceProcessPattern = this.addComplianceProcessPattern.bind(this);
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
    const layout = this.graph.layout({ name: 'breadthfirst' }); // more options http://js.cytoscape.org/#layouts
    layout.run(); // graph.autolock(false); //elements can not be moved by the user
    GraphRenderer.resizeGraph(this.graph);
    GraphRenderer.colorNodes(this.graph);
    this.hookGraphOnClick(this.graph);
  }

  hookGraphOnClick(graph){
    const _this = this;

    graph.on('click', (evt) => { // http://js.cytoscape.org/#core/events
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

  addComplianceRequirement(){
    const req = this.state.selectedCompliance;

    if (req !== null){
      const isUnique = GraphEditor.addNode(this.graph, { req: req });
      if (!isUnique){
        this.growl.show({ severity: 'warn', summary: 'Compliance requirement already in the graph.', detail:'' });
      }
    } else {
      this.growl.show({ severity: 'warn', summary: 'Please select an compliance requirement from the list.', detail:'' });
    }
  }

  addComplianceProcess(){

  }

  addComplianceProcessPattern(){
    if (this.state.nodeType === null) {
      this.growl.show({ severity: 'warn', summary: 'Please select an compliance requirement from the graph.', detail:'' });
    } else if (this.state.nodeType !== 'compliance') {
      this.growl.show({ severity: 'warn', summary: 'Please select an compliance requirement from the graph.', detail:'' });
    } else {

    }
  }

  selectCompliance(selectedRequirement){
    this.setState({ selectedCompliance: selectedRequirement });
  }

  removeNode(){
    const id = this.state.nodeId;
    let node = this.graph.getElementById(id);

    if (node !== null){
      GraphEditor.removeNode(node);
      this.renderGraphProps(null);
    } else {
      this.growl.show({ severity: 'warn', summary: 'Please select a node from the graph.', detail:'' });
    }
  }

  renderGraphPropsPanel(){
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
        <div>
          <Button label="remove node" onClick={this.removeNode} />
        </div>
      </div>
    )
  }

  renderGraphEditPanel(){
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
          <Button label="add req" onClick={this.addComplianceRequirement} />
          <br />
          <br />
          <Button label="add pattern" onClick={this.addComplianceProcessPattern} />
          <br />
          <br />
          <Button label="add compliance process" onClick={this.addComplianceProcess} />
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
