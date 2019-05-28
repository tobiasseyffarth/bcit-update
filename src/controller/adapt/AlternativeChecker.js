// contains functions to check whether alternatives can be executed
import * as GraphQuery from './../graph/GraphQuery';
import * as ProcessQuery from './../process/ProcessQuery';

/*

W(Task_A): bis Task_A --> W:Weak Unitl
Task_A -> X(Task_B): Task_B direkt nach Task_A --> X: next

G(Task_A -> F(Task_B)): Task_B kommt irgendwann nach Task_A --> F: eventually

*/

function getTaskId(ltlString) {
  const start = ltlString.indexOf('W(') + 1;
  let result = new String();

  for (let i = start; ltlString.length; i++){
    const char = ltlString.charAt(i);

    if (char !== ')'){
      result += char;
    } else {
      break;
    }
  }
  return result;
}

function isTaskBefore(taskId, sucId, viewer) {
  const shape = ProcessQuery.getShapeOfRegistry(viewer, taskId);
  const sucs = ProcessQuery.getSucessorShapes(viewer, shape);

  for (let i = 0; i < sucs.length; i++) {
    const shapeSuc = sucs[i];
    if (sucId === shapeSuc.id) {
      return true;
    }
  }
  return false
}

function isTaskAfter(taskId, predId, viewer) {

}

function isTaskBetween(startTaskId, endTaskId, viewer) {

}

export function isExecutable(cpNode, reqNode, deleteGraph, viewer) {
  const trigger = GraphQuery.getPropsValue(cpNode.data('props'), 'trigger');
  const furtherReq = GraphQuery.getPropsValue(cpNode.data('props'), 'req');
  const until = GraphQuery.getPropsValue(reqNode.data('props'), 'until');

  /*
  console.log('****');
  console.log('check for ', cpNode.data('name'));
  console.log('trigger', trigger);
  console.log('furtherReq for Execution', furtherReq);
  console.log('executed until', until);
  */

  // 1st check whether the requirements to execute are obsolete in the result graph
  const nodes = deleteGraph.nodes();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (furtherReq === node.data('id')){
      return false;
    }
  }

  // 2nd check whether trigger is before until
  if (isTaskBefore(trigger, until, viewer)) {
    return true;
  } else {
    return false;
  }
}
