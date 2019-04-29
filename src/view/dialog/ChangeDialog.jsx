import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import * as GraphRenderer from "../../controller/graph/GraphRenderer";
import cytoscape from "cytoscape";

class ChangeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleDialog: false,
      visibleAlternative: false,
    };
    this.onHide = this.onHide.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({visibleDialog: nextProps.showChangeDialog});
  }

  onHide() {
    this.props.close();
    this.setState({visibleDialog: false});
  }

  onShow() {
    if (ProjectModel.getChangeGraph() !== null) {
      this.renderChangeGraph(ProjectModel.getChangeGraph());
    }
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
              visible={this.state.visibleDialog}
              style={{ width: '80vw' }}
              onHide={this.onHide}
              onShow={() => this.onShow()}
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
        {this.renderChangeDialog()}
      </div>
    );
  }
}

export default ChangeDialog;
