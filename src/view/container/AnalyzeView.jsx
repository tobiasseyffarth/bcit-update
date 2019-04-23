import React, { Component } from 'react';
import { Button } from 'primereact/button';
import '../../App.css';
import cytoscape from 'cytoscape';
import * as GraphCreator from '../../controller/graph/GraphEditor';
import * as GraphRenderer from '../../controller/graph/GraphRenderer';
import ProjectModel from '../../models/ProjectModel';

class AnalyzeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infra: null,
    };

    this.mountGraph = this.mountGraph.bind(this);
  }

  componentDidMount() {
    // this.onMount();
  }

  onMount() {
    console.log('hello');
    if (ProjectModel.getAnalyzeDelete() !== null) {
      this.graph = null;
      const graph = ProjectModel.getAnalyzeDelete();
      this.renderGraph(graph);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show !== this.props.show){
      const prop = this.props.show;
      console.log(prop);
      this.onMount();
    } else {
      console.log('same props');
    }
  }

  mountGraph(){
    console.log('click');
    const container = document.getElementById('infra-container-delete');
    console.log(container);
    console.log(this.graph);
    this.graph.mount(container);

    GraphRenderer.styleEdgesAnalyzeGraph(this.graph);
    GraphRenderer.styleNodesAnalyzeGraph(this.graph);
    GraphRenderer.drawAnalyze(this.graph);
    GraphRenderer.resizeGraph(this.graph);
  }

  renderGraph(graph){
    const graphDelete = cytoscape({
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

    GraphRenderer.removeElements(graphDelete);
    GraphRenderer.copyGraphElements(graphDelete, graph);
    /*
   // graphDelete.mount(container);
    GraphRenderer.styleEdgesAnalyzeGraph(graphDelete);
    GraphRenderer.styleNodesAnalyzeGraph(graphDelete);
    GraphRenderer.drawAnalyze(graphDelete);
    GraphRenderer.resizeGraph(graphDelete);
*/
    this.graph = graphDelete;
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

  render() {
    return (
      <section className="container-graph">
        <div className="viewer" style={{ width: '100%' }} id="infra-container-delete" />
        <div className="property-panel">
          <Button label="close" onClick={this.mountGraph} />
        </div>
      </section>
    );
  }
}

export default AnalyzeView;
