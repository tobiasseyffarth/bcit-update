import * as AlternativeChecker from './AlternativeChecker';
import * as GraphQuery from './../graph/GraphQuery';

// contains functions to find alternative CP from the AltGraph

function getAlternativeCP(altGraph, violatedCP, resultGraph){

  // get Sibling

  // get leafes

  // check all nodes from leaf to common element --> take the first appropriate node

  const nodeReq = GraphQuery.getSuccessors(violatedCP, 'compliance');
  const isExecutable = AlternativeChecker.isExecutable(violatedCP, nodeReq, resultGraph);

}

function getAlternativePattern(violatedCP){
  // get first successor node of type pattern
  const cpPattern = GraphQuery.getSuccessors(violatedCP, 'complianceprocesspattern');
  return cpPattern
}

export function getAlternatives(altGraph, violatedCP){
  let  result = getAlternativeCP(altGraph, violatedCP);

  if (result.length === 0){
    result = getAlternativePattern(altGraph, violatedCP);
  }

  return result;
}
