import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Growl } from 'primereact/growl';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import cytoscape from 'cytoscape';
import AlternativeView from './AlternativeView';
import '../../App.css';
import * as GraphCreator from '../../controller/graph/GraphEditor';
import * as GraphRenderer from '../../controller/graph/GraphRenderer';
import * as GraphQuery from "../../controller/graph/GraphQuery";
import * as AnalyzeChange from "../../controller/analyze/AnalyzeChange";
import * as InfraQuery from "../../controller/infra/InfraQuery";
import ProjectModel from '../../models/ProjectModel';

class InfraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infra: null,
      itComponent: null,
      itComponentId: null,
      itComponentName: null,
      width: 0,
      visibleRemove: false,
      visibleChange: false,
      visibleAlternative: false,
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null
    };

    this.onHide = this.onHide.bind(this);
    this.showAlternativeDialog = this.showAlternativeDialog.bind(this);
    this.getChangeGraph = this.getChangeGraph.bind(this);
    this.getRemoveGraph = this.getRemoveGraph.bind(this);
  }

  componentDidMount() {
    this.onMount();
    const width = this.props.setWidth;
    const infraProps = document.getElementById('infra-props-panel');
    const infraPropsWidth = infraProps.offsetWidth;
    this.state.width = width - infraPropsWidth;
  }

  onMount() {
    if (ProjectModel.getInfra() !== null) {
      const infra = ProjectModel.getInfra();
      this.setState({ infra }, () => {
        this.renderInfra(infra);
      });
    }
  }

  onHide() {
    this.setState({ visibleRemove: false });
    this.setState({ visibleChange: false });
    this.setState({ visibleAlternative: false });
  }

  showAlternativeDialog(){
    this.setState({ visibleAlternative: true });
  }

  renderInfra(infra){
    const container = document.getElementById('infra-container');
    const graph = cytoscape({
      container,
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            label: 'data(display_name)',
            shape: 'triangle',
            'background-color': '#ffffff',
            'border-style': 'solid',
            'border-color': '#666666',
            'border-width': 1,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#1c2966',
            'mid-target-arrow-color': '#3040b7',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted',
          },
        },
      ],
    });

    GraphCreator.createGraphFromInfra(graph, infra);
    const layout = graph.layout({ name: 'breadthfirst' }); // more options http://js.cytoscape.org/#layouts
    layout.run();
    graph.autolock(false); // elements can not be moved by the user
    GraphRenderer.resizeGraph(graph);
    this.hookInfraOnClick(graph);
  }

  hookInfraOnClick(graph){
    const _this = this;
    const { infra } = this.state;

    graph.on('tap', (evt) => { // http://js.cytoscape.org/#core/events
      const element = evt.target;
      if (element === graph) { // background
        _this.renderInfraProps(null);
      } else {
        if (element.isNode()) { // edge
          const id = element.data('id');
          const itComponent = InfraQuery.getElementById(infra, id);
          _this.renderInfraProps(itComponent);
        }
      }
    });
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
    const itComponent = this.state.itComponent;
    const graph = ProjectModel.getGraph();
    let deleteGraph = AnalyzeChange.getDeleteGraph({itComponent: itComponent}, graph);

    if(!deleteGraph){
      this.growl.show({ severity: 'warn', summary: 'Can not analyze element', detail: 'Can not analyze this element.' });
    } else {
      if (deleteGraph !== null && deleteGraph.nodes().length > 1){
        this.setState({ visibleRemove: true }, () => {
            this.renderRemoveGraph(deleteGraph)
          },
        );
      }
      if (deleteGraph !== null && deleteGraph.nodes().length <= 1){
        const detail = 'no violations found';
        this.growl.show({ severity: 'info', summary: 'No compliance violation', detail });
      }
    }
  }

  getChangeGraph(){
    const itComponent = this.state.itComponent;
    const graph = ProjectModel.getGraph();
    let changeGraph = AnalyzeChange.getChangeGraph({itComponent: itComponent}, graph);

    if(!changeGraph){
      this.growl.show({ severity: 'warn', summary: 'Can not analyze element', detail: 'Can not analyze this element.' });
    } else {
      if (changeGraph !== null && changeGraph.nodes().length > 1){
        this.setState({ visibleChange: true }, () => {
              this.renderChangeGraph(changeGraph);
            },
        );
      }
      if (changeGraph !== null && changeGraph.nodes().length <= 1){
        const detail = 'no demands found';
        this.growl.show({ severity: 'info', summary: 'No compliance violation', detail });
      }
    }
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

  renderInfraProps(itComponent){
    if (itComponent !== null) {
      this.setState({ itComponent: itComponent });
      this.setState({ itComponentId: itComponent.id });
      this.setState({ itComponentName: itComponent.name });
    } else {
      this.setState({ itComponent: null });
      this.setState({ itComponentId: null });
      this.setState({ itComponentName: null });
    }
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

  renderInfraPropsPanel() {
    return (
      <div className="property-panel" id="infra-props-panel">
        <div>
          <label>ID: {this.state.itComponentId}</label>
        </div>
        <br />
        <div>
          <label>Name: {this.state.itComponentName}</label>
        </div>
        <br />
        <br />
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

  renderAlternativeDialog(){
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
              visible={this.state.visibleAlternative}
              style={{ width: '80vw' }}
              onHide={this.onHide}
              maximizable
          >
            <section className="container-graph">
              <AlternativeView />
            </section>
          </Dialog>
        </div>
    );
  }

  renderRemoveDialog() {
    const footer = (
        <div>
          <Button label="show alternatives" onClick={this.showAlternativeDialog} />
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
          {this.renderRemoveDialog()}
          {this.renderChangeDialog()}
          {this.renderAlternativeDialog()}
          <section className="container-infra">
            <div className="viewer" id="infra-container" style={{width:this.state.width}}/>
            {this.renderInfraPropsPanel()}
          </section>
        </div>
      </div>
    );
  }
}

export default InfraView;
