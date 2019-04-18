import cytoscape from "cytoscape";
import * as creategraph from "./../graph/GraphEditor";
import * as analyzehelper from "./AnalyzeHelper";
import * as rendergraph from "./../graph/GraphRenderer";


//final?
export function getGraphReplaceITComponent(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');

  analyzehelper.replaceITDirect(graph, node, result_graph);
  analyzehelper.replaceITTransitive(graph, node, result_graph);

  return result_graph;
}

//final?
export function getGraphDeleteITComponent(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');

  analyzehelper.deleteITObsolete(graph, _node, result_graph);
  analyzehelper.deleteITViolation(graph, _node, result_graph);

  return result_graph;
}

export function getGraphReplaceRequirement(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');
  analyzehelper.replaceComplianceTransitive(graph, _node, result_graph);
  analyzehelper.replaceComplianceDirect(graph, _node, result_graph);

  return result_graph;
}

export function getGraphDeleteRequirement(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');
  analyzehelper.deleteComplianceObsolete(graph, _node, result_graph);
  return result_graph;
}

export function getGraphReplaceBusinessActivity(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');
  analyzehelper.replaceActivityDirect(graph, _node, result_graph);
  analyzehelper.replaceProcessTransitive(graph, _node, result_graph);

  rendergraph.removeActivity(result_graph); //workaround

  return result_graph;
}

export function getGraphDeleteBusinessActivity(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');
  analyzehelper.deleteActivityObsolte(graph, _node, result_graph);

  return result_graph;
}

//final?
export function getGraphReplaceComplianceProcess(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');

  analyzehelper.replaceComplianceProcessDirect(graph, _node, result_graph);
  analyzehelper.replaceProcessTransitive(graph, _node, result_graph);

  rendergraph.removeActivity(result_graph); //workaround

  return result_graph;
}

//final?
export function getGraphDeleteComplianceProcess(graph, node) {
  let result_graph = cytoscape({/* options */});
  let _node = node;

  creategraph.addUniqueNode(result_graph, {node: _node}, 'changedElement');

  analyzehelper.deleteComplianceProcessObsolete(graph, _node, result_graph);
  analyzehelper.deleteComplianceProcessViolation(graph, _node, result_graph);

  return result_graph;
}
