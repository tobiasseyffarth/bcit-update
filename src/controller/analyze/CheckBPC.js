import * as GraphQuery from './../graph/GraphQuery';
import cytoscape from "cytoscape";

function checkBPC(graph) {
  const resultGraph = cytoscape({/* options */});

  // 1st get all business nodes --> done
  const businessNodes = GraphQuery.filterNodes(graph, {type: 'businessprocess'});

  // 2nd get compliance requirement of each businessNode
  let compliance = [];
  businessNodes.forEach(node => {
    const preds = GraphQuery.getPredecessors(node, 'compliance');
    console.log(node);
    console.log(preds);

    // 3rd check compliance process of first entry


    // 4th if no compliance process append preds to compliance
  });

  // 5th add nodes to result graph and connect nodes

  return resultGraph;
}

export function getViolatedGraph(graph) {
  console.log(graph.nodes());
  return checkBPC(graph);
}
