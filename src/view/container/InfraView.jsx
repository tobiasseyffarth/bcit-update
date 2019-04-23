import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import '../../App.css';
import * as GraphCreator from '../../controller/graph/GraphEditor';
import * as GraphRenderer from '../../controller/graph/GraphRenderer';
import ProjectModel from '../../models/ProjectModel';

class InfraView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infra: null,
    };
  }

  componentDidMount() {
    this.onMount();
  }

  onMount() {
    if (ProjectModel.getInfra() !== null) {
      const infra = ProjectModel.getInfra();
      this.setState({ infra }, () => {
        this.renderInfra(infra);
      });
    }
  }

  componentWillReceiveProps() {

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
  }

  render() {
    return (
      <div className="viewer" id="infra-container" />
    );
  }
}

export default InfraView;
