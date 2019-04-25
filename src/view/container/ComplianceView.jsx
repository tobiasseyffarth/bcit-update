import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Growl } from 'primereact/growl';
import { Dialog } from 'primereact/dialog';
import cytoscape from 'cytoscape';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import * as GraphQuery from '../../controller/graph/GraphQuery';
import * as ComplianceQuery from './../../controller/compliance/ComplianceQuery';
import * as AnalyzeChange from '../../controller/analyze/AnalyzeChange';
import * as GraphRenderer from '../../controller/graph/GraphRenderer';

class ComplianceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      compliance: [], // whole compliance from ProjectModel
      complianceFilter: [], // compliance elements for ListBox
      complianceText: '', // Text for TextArea
      selectedCompliance: null, // selected element in the listbox
      visibleRemove: false,
      visibleChange: false,
      visibleAlternative: false,
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null,
      nodeProps: [],
    };

    this.onHide = this.onHide.bind(this);
    this.getChangeGraph = this.getChangeGraph.bind(this);
    this.getRemoveGraph = this.getRemoveGraph.bind(this);
  }

  componentDidMount() {
    this.filterCompliance();
  }

  onHide() {
    this.setState({ visibleRemove: false });
    this.setState({ visibleChange: false });
    this.setState({ visibleAlternative: false });
  }

  hookGraphOnClick(graph){
    const _this = this;

    graph.on('click', (evt) => { // http://js.cytoscape.org/#core/events
      const element = evt.target;
      if (element === graph) { // background
        _this.renderGraphProps(null);
      } else if (element.isNode()) { // edge
        _this.renderGraphProps(element);
      }
    });
  }

  getRemoveGraph(){
    const req = this.state.selectedCompliance;

    if (req === null){
      this.growl.show({ severity: 'warn', summary: 'Please select a compliance requirement.', detail:'' });
    } else {
      const graph = ProjectModel.getGraph();
      const deleteGraph = AnalyzeChange.getDeleteGraph({req}, graph);

      if (!deleteGraph) {
        this.growl.show({
          severity: 'warn',
          summary: 'Can not analyze element',
          detail: 'Can not analyze this element.'
        });
      } else {
        if (deleteGraph !== null && deleteGraph.nodes().length > 1) {
          this.setState({visibleRemove: true}, () => {
                this.renderRemoveGraph(deleteGraph);
              },
          );
        }
        if (deleteGraph !== null && deleteGraph.nodes().length <= 1) {
          const detail = 'no violations found';
          this.growl.show({severity: 'info', summary: 'No compliance violation', detail});
        }
      }
    }
  }

  getChangeGraph(){
    const req = this.state.selectedCompliance;

    if (req === null){
      this.growl.show({ severity: 'warn', summary: 'Please select a compliance requirement.', detail:'' });
    } else {
      const graph = ProjectModel.getGraph();
      const changeGraph = AnalyzeChange.getChangeGraph({req}, graph);

      if (!changeGraph) {
        this.growl.show({
          severity: 'warn',
          summary: 'Can not analyze element',
          detail: 'Can not analyze this element.'
        });
      } else {
        if (changeGraph !== null && changeGraph.nodes().length > 1) {
          this.setState({visibleChange: true}, () => {
                this.renderChangeGraph(changeGraph);
              },
          );
        }
        if (changeGraph !== null && changeGraph.nodes().length <= 1) {
          const detail = 'no demands found';
          this.growl.show({severity: 'info', summary: 'No compliance violation', detail});
        }
      }
    }
  }

  filterCompliance(){
    const graph = ProjectModel.getGraph();
    const compliance = ProjectModel.getCompliance();
    const complianceNodes = GraphQuery.filterNodes(graph, { type: 'compliance' });
    const complianceFilter = [];

    for (let i = 0; i < complianceNodes.length; i++){
      const id = complianceNodes[i].data('id');
      const req = ComplianceQuery.getRequirementById(compliance.requirement, id);
      complianceFilter.push(req);
    }
    this.setState({ complianceFilter });
  }

  selectCompliance(selectedCompliance){
    const compliance = ProjectModel.getCompliance();
    const { id } = selectedCompliance;
    const reqText = ComplianceQuery.toString(compliance.requirement, id);
    this.setState({ selectedCompliance });
    this.setState({ complianceText: reqText });
  }

  renderRemoveGraph(graph) {
    const containerRemove = document.getElementById('graph-container-remove');
    const graphDelete = cytoscape({
      container: containerRemove,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'white',
            'border-style': 'solid',
            'border-color': 'black',
            'border-width': 1,
            label: 'data(display_name)',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 20,
            shape: 'rectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#666',
            'mid-target-arrow-color': '#666',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    GraphRenderer.renderAnalyzeGraph(graphDelete, graph);
    this.hookGraphOnClick(graphDelete);
  }

  renderChangeGraph(graph) {
    const containerChange = document.getElementById('graph-container-change');
    const graphChange = cytoscape({
      container: containerChange,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': 'white',
            'border-style': 'solid',
            'border-color': 'black',
            'border-width': 1,
            label: 'data(display_name)',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 20,
            shape: 'rectangle',
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#666',
            'mid-target-arrow-color': '#666',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });

    GraphRenderer.renderAnalyzeGraph(graphChange, graph);
    this.hookGraphOnClick(graphChange);
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
      </div>
    );
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

  renderRemoveDialog() {
    const footer = (
      <div>
        <Button label="close" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Graph Remove"
          footer={footer}
          visible={this.state.visibleRemove}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          maximizable
        >
          <section className="container-graph">
            <div className="viewer" id="graph-container-remove" />
            {this.renderGraphPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
  }

  renderChangeDialog() {
    const footer = (
      <div>
        <Button label="close" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Graph Change"
          footer={footer}
          visible={this.state.visibleChange}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          maximizable
        >
          <section className="container-graph">
            <div className="viewer" id="graph-container-change" />
            {this.renderGraphPropsPanel()}
          </section>
        </Dialog>
      </div>
    );
  }

  renderComplianceSelector(){
    const option = this.state.complianceFilter;
    const value = this.state.selectedCompliance;

    return (
      <div className="viewer">
        <div>
          <section className="container-compliance">
            <div className="compliance-view-selector">
              <ListBox
                style={{ height: '98%', width: '98%' }}
                optionLabel="id"
                value={value}
                options={option}
                onChange={e => this.selectCompliance(e.value)}
                filter
              />
            </div>
            <div className="compliance-view-text">
              <InputTextarea
                readOnly
                style={{ width: '100%', height: '98%' }}
                cols={60}
                value={this.state.complianceText}
                autoResize={false}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }

  renderCompliancePropsPanel(){
    return (
      <div className="property-panel">
        <Button
          label="show result when remove"
          onClick={this.getRemoveGraph}
          tooltip="show compliance violation when removing these element"
        />
        <br />
        <br />
        <Button
          label="show result when change"
          onClick={this.getChangeGraph}
          tooltip="show demands by compliance requirements when changing these element"
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderRemoveDialog()}
        {this.renderChangeDialog()}
        <Growl ref={(el) => { this.growl = el; }} position="topright" />
        <div>
          <section className="container-compliance">
            {this.renderComplianceSelector()}
            {this.renderCompliancePropsPanel()}
          </section>
        </div>
      </div>
    );
  }
}

export default ComplianceView;
