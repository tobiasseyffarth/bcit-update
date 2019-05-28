import * as AlternativeChecker from './AlternativeChecker';
import * as GraphQuery from './../graph/GraphQuery';
import * as ProcessQuery from './../process/ProcessQuery';

// contains functions to find alternative CP from the AltGraph

function getAlternativeCP(altGraph, violatedCP, deleteGraph) {
  let result = [];
  const nodeReq = GraphQuery.getSuccessors(violatedCP, 'compliance')[0].data();
  let nodeViolatedCP;

  // get violated cp node from alternative graph
  const nodes = altGraph.nodes();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i].data();
    if (node.cpid !== undefined && node.cpid === violatedCP.id()) {
      nodeViolatedCP = node;
      break;
    }
  }

  console.log('node requirement', nodeReq);
  console.log('node violated cp', nodeViolatedCP);

  /*
  // get Sibling Compliance Process
  const cpps = GraphQuery.getSuccessors(violatedCP, 'complianceprocesspattern');
  for (let i = 0; i < cpps.length; i++) {
    const pattern = cpps[i];
    const complianceProcess = GraphQuery.getPredecessors(pattern, 'complianceprocess');
    console.log(complianceProcess);
    const isExecutable = AlternativeChecker.isExecutable(complianceProcess, nodeReq, deleteGraph);

    if (isExecutable) {
      result.push(complianceProcess); // todo: compliance process has a trigger == direct predecessor
    }
  }
  return result;

  */
}

function getAlternativePattern(violatedCP) {
  // get first successor node of type pattern
  const cpps = GraphQuery.getSuccessors(violatedCP, 'complianceprocesspattern');
  const cp = cpps[0];
  return cp;
}

export function getAlternatives(altGraph, deleteGraph) {
  const violatedComplianceProcesses = GraphQuery.filterNodes(deleteGraph, { type: 'complianceprocess' });
  let result = [];

  for (let i = 0; i < violatedComplianceProcesses.length; i++){
    const violatedComProcess = violatedComplianceProcesses[i];
    const reqs = GraphQuery.getDirectSuccessor(violatedComProcess, 'compliance');
    console.log('violated compliance process', violatedComProcess);
    console.log('violated reqs', reqs);

    let alternativeCP = getAlternativeCP(altGraph, violatedComProcess);

    /*
    if (alternativeCP.length === 0) {
      alternativeCP = getAlternativePattern(altGraph, violatedComProcess);
    }

    result.push({
      violatedCP: violatedComProcess,
      alternativeCP: alternativeCP
    });

    */
  }

  return result;
}
