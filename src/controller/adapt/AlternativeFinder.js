import * as AlternativeChecker from './AlternativeChecker';
import * as GraphQuery from './../graph/GraphQuery';

// contains functions to find alternative CP from the AltGraph

function getAlternativeCP(altGraph, violatedCP, resultGraph){
  let result = [];
  const nodeReq = GraphQuery.getSuccessors(violatedCP, 'compliance');

  // get Sibling Compliance Process
  const cpps = GraphQuery.getSuccessors(violatedCP, 'complianceprocesspattern');
  for (let i = 0; i < cpps.length; i++) {
    const pattern = cpps[i];
    const complianceProcess = GraphQuery.getPredecessors(pattern, 'complianceprocess');
    console.log(complianceProcess);
    const isExecutable = AlternativeChecker.isExecutable(complianceProcess, nodeReq, resultGraph);

    if (isExecutable) {
      result.push(complianceProcess);
    }
  }
  return result;
}

function getAlternativePattern(violatedCP){
  // get first successor node of type pattern
  const cpps = GraphQuery.getSuccessors(violatedCP, 'complianceprocesspattern');
  const cp = cpps[0];
  return cp;
}

export function getAlternatives(altGraph, violatedCP){
  let result = getAlternativeCP(altGraph, violatedCP);

  if (result.length === 0){
    result = getAlternativePattern(altGraph, violatedCP);
  }

  return result;
}
