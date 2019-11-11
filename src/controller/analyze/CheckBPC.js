import * as GraphQuery from './../graph/GraphQuery';
import cytoscape from "cytoscape";

function checkBPC(graph) {
  const resultGraph = cytoscape({/* options */});

  // 1st get all business nodes --> done
  const businessNodes = GraphQuery.filterNodes(graph, {type: 'businessprocess'});

  // 2nd get compliance requirement of each businessNode
  let resultElements = [];
  businessNodes.forEach(businessNode => {
    const preds = GraphQuery.getPredecessors(businessNode, 'compliance');

    // 3rd check compliance process of first entry
    if (preds.length > 0) {
      console.log(businessNode);
      const complianceRequirement = preds[0];
      console.log(complianceRequirement);

      const complianceProcesses = GraphQuery.getPredecessors(complianceRequirement, 'complianceprocess');
      console.log(complianceProcesses);

      // 4th if no compliance process append preds to compliance
      if (complianceProcesses.length === 0) {
        console.log('violation');
        resultElements.push(complianceRequirement); // add compliance requirement
        resultElements.push(businessNode); // add business node
      }
    }
  });

  // 5th add nodes to result graph and connect nodes



  return resultGraph;
}

export function getViolatedGraph(graph) {
  console.log(graph.nodes());
  return checkBPC(graph);
}
