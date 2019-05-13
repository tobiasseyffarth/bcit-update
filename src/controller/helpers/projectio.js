import * as GraphEditor from './../graph/GraphEditor';

export function getElementsFromGraph(graph){
  const nodes = graph.nodes();
  const edges = graph.edges();

  const graphElements = {
    node: [],
    edge: [],
  };

  for (let i = 0; i < nodes.length; i++) {
    const _node = nodes[i];
    graphElements.node.push(_node.data());
  }

  for (let i = 0; i < edges.length; i++) {
    const _edge = edges[i];
    graphElements.edge.push(_edge.data());
  }

  return graphElements;
}

export function getGraphFromElements(elements){
  const graph = GraphEditor.getEmptyGraph();
  const nodes = elements.node;
  const edges = elements.edge;

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    graph.add({
      group: 'nodes',
      data: node,
    });
  }

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];

    graph.add({
      group: 'edges',
      data: edge,
    });
  }
  return graph;
}
