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
      altGraph: null,
      nodeId: null,
      nodeName: null,
      nodeType: null,
      modelType: null,
      nodeProps: [],
    };

    this.removeNode = this.removeNode.bind(this);
    this.addNode = this.addNode.bind(this);
  }

  componentDidMount(){
    this.onMount();
  }

  onMount(){
    const container = document.getElementById('alt-graph-container');
    let graph = ProjectModel.getAltGraph();

    if (graph === null){
      graph = GraphEditor.getEmptyGraph();
      ProjectModel.setAltGraph(graph);
    }

    graph.mount(container);
    const layout = graph.layout({ name: 'breadthfirst' }); // more options http://js.cytoscape.org/#layouts
    layout.run(); // graph.autolock(false); //elements can not be moved by the user
    GraphRenderer.resizeGraph(graph);
    GraphRenderer.colorNodes(graph);
    this.hookGraphOnClick(graph);
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

  addNode(){
    let graph = ProjectModel.getAltGraph();
    let req = {
      id: 12,
      name: 'test'
    };
    GraphEditor.addNode(graph, { req: req });
    ProjectModel.setAltGraph(graph);
  }

  removeNode(){
    let graph = ProjectModel.getAltGraph();
    const id = this.state.nodeId;
    let node = graph.getElementById(id);

    if (node !== null){
      GraphEditor.removeNode(node);
    }

    ProjectModel.setAltGraph(graph);
  }

  renderGraphPropsPanel(){
    return(
      <div className="property-panel">
        <div>
          props panel
        </div>
      </div>
    )
  }

  renderGraphEditPanel(){
    return(
      <div className="property-panel">
        <div>
          <Button label="add node" onClick={this.addNode} />
          <br />
          <br />
          <Button label="remove node" onClick={this.removeNode} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <section className="container-graph">
          {this.renderGraphEditPanel()}
          <div className="viewer" id="alt-graph-container" />
          {this.renderGraphPropsPanel()}
        </section>
      </div>
    );
  }
}

Alternatives.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
