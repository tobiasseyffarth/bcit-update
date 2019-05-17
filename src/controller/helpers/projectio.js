import Projectmodel from './../../models/ProjectModel';
import * as GraphEditor from './../graph/GraphEditor';
import * as FileIo from './fileio';

export function getElementsFromGraph(graph) {
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

export function getGraphFromElements(elements) {
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

export function newProject() {
  Projectmodel.setAltGraph(null);
  Projectmodel.setRemoveGraph(null);
  Projectmodel.setChangeGraph(null);
  Projectmodel.setGraph(null);
  Projectmodel.setInfra(null);
  Projectmodel.setBpmnXml(null);
  Projectmodel.setCompliance(null);
  Projectmodel.setViewer(null);
  Projectmodel.setName(null);
}

export async function openProject(){
  const file = await FileIo.getFile();
  const fileContent = await FileIo.readFile(file);
  const projectFile = JSON.parse(fileContent);

  const graph = getGraphFromElements(projectFile.graph);
  const altGraph = getGraphFromElements(projectFile.altGraph);

  Projectmodel.setBpmnXml(projectFile.bpmn);
  Projectmodel.setInfra(projectFile.infra);
  Projectmodel.setCompliance(projectFile.compliance);
  Projectmodel.setGraph(graph);
  Projectmodel.setAltGraph(altGraph);
}

export async function saveProject(){

  /*
  const compliance = JSON.stringify(Projectmodel.getCompliance());
  const infra = JSON.stringify(Projectmodel.getInfra());
  const graphElements = JSON.stringify(getElementsFromGraph(Projectmodel.getGraph()));
  const altGraphElements = JSON.stringify(getElementsFromGraph(Projectmodel.getAltGraph()));

  console.log('graph', JSON.stringify(altGraphElements));
  */

  let projectFile = {
    bpmn: Projectmodel.getBpmnXml(),
    infra: Projectmodel.getInfra(),
    compliance: Projectmodel.getCompliance(),
    graph: getElementsFromGraph(Projectmodel.getGraph()),
    altGraph: getElementsFromGraph(Projectmodel.getAltGraph())
  };

  const output = JSON.stringify(projectFile);
  const readFile = JSON.parse(output);
  console.log(readFile);
}

