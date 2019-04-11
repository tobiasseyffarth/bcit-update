export function getDirectPredecessor(node, nodetype) {
  let helper = [];
  helper = node.incomers();
  let predecessors = [];
  let exclude;
  let _nodetype;

  if (nodetype !== null && nodetype.includes('!')) {
    exclude = true;
    _nodetype = nodetype.replace('!', ''); //remove ! for checking the nodetypes
  } else {
    exclude = false;
    _nodetype = nodetype;
  }

  for (let i = 0; i < helper.length; i++) {
    if (helper[i].isNode()) {
      if (nodetype === null) {
        predecessors.push(helper[i]);
      }

      if (nodetype !== null && exclude === false) {
        if (helper[i].data('nodetype') === _nodetype) {
          predecessors.push(helper[i]);
        }
      } else if (nodetype !== null && exclude === true) {
        if (helper[i].data('nodetype') !== _nodetype) {
          predecessors.push(helper[i]);
        }
      }
    }
  }
  return predecessors;
}

export function getDirectSuccessor(node, nodetype) {
  // let helper = [];
  let successor = [];
  // helper = node.outgoers();
  let helper = node.outgoers();
  let _nodetype;
  let exclude;

  if (nodetype != null && nodetype.includes('!')) {
    exclude = true;
    _nodetype = nodetype.replace('!', ''); //remove ! for checking the nodetypes
  } else {
    exclude = false;
    _nodetype = nodetype;
  }

  for (let i = 0; i < helper.length; i++) {
    if (helper[i].isNode()) {
      if (nodetype == null) {
        successor.push(helper[i]);
      }

      if (nodetype != null && exclude === false) {
        if (helper[i].data('nodetype') === _nodetype) {
          successor.push(helper[i]);
        }
      } else if (nodetype != null && exclude === true) {
        if (helper[i].data('nodetype') !== _nodetype) {
          successor.push(helper[i]);
        }
      }
    }
  }
  return successor;
}

export function filterNodesByType(nodes, type) {
  let result = [];

  for (let i in nodes) {
    if (nodes[i].data('nodetype') === type) {
      result.push(nodes[i]);
    }
  }
  return result;
}

export function filterNodes(eles) {
  let nodes = [];

  for (let i = 0; i < eles.length; i++) {
    if (eles[i].isNode()) {
      nodes.push(eles[i]);
    }
  }

  return nodes;
}

export function getEdge(source, target) {
  let sourceEdge = source.connectedEdges();
  let targetEdge = target.connectedEdges();

  for (let i = 0; i < sourceEdge.length; i++) {
    for (let j = 0; j < targetEdge.length; j++) {
      if (sourceEdge[i] === targetEdge[j]) {
        return sourceEdge[i];
      }
    }
  }
}

export function getNodesBetween(source, target) {
  let succ = source.successors().filter('node');
  let pred = target.predecessors().filter('node');
  let nodes = [];

  for (let i = 0; i < succ.length; i++) {
    let node_suc = succ[i];
    for (let j = 0; j < pred.length; j++) {
      let node_pred = pred[j];
      if (node_suc === node_pred) {

        //avoid dublett
        let isUnique = true;
        for (let k = 0; k < nodes.length; k++) {
          if (node_suc === nodes[k]) {
            isUnique = false;
            break;
          }
        }

        if (isUnique) {
          nodes.push(node_suc);
        }
      }
    }
  }

  return nodes;
}

export function getLeavesOfType(node, modeltype) {
  let leaves = [];
  // let suc = node.successors().filter('node');
  let type;

  if (modeltype != null) {
    type = modeltype;
  } else {
    type = node.data('modeltype');
  }

  let suc = getSuccessors(node, type);

  if (suc.length === 0) {
    return node;
  }

  //check direct successor
  let dir_suc = getDirectSuccessor(node);
  let isLeave = false;
  for (let i = 0; i < dir_suc.length; i++) {
    if (dir_suc[i].data('modeltype') !== type) {
      isLeave = true;
      break;
    }
  }

  if (isLeave) {
    leaves.push(node);
  }

  //check successor
  for (let i = 0; i < suc.length; i++) {
    let node_check = suc[i];
    if (node_check.data('modeltype') === type) {
      let dir_suc = getDirectSuccessor(node_check);

      if (dir_suc.length === 0) {
        leaves.push(node_check);
      } else {
        for (let j = 0; j < dir_suc.length; j++) {
          if (dir_suc[j].data('modeltype') !== type) {
            leaves.push(node_check);
          }
        }
      }
    }
  }

  return leaves;
}

export function getPredecessors(node, nodetype) {
  let dirPreds = getDirectPredecessor(node, nodetype);

  return getPredsOfType(dirPreds, nodetype, dirPreds);
}

function getPredsOfType(to_check, nodetype, preds) {
  let toCheck = to_check;
  let newCheck = [];

  for (let i = 0; i < toCheck.length; i++) {
    let dir_pred = getDirectPredecessor(toCheck[i], nodetype);

    for (let j = 0; j < dir_pred.length; j++) {
      preds.push(dir_pred[j]);
      newCheck.push(dir_pred[j]);
    }
  }

  if (newCheck.length > 0) {
    return getPredsOfType(newCheck, nodetype, preds);
  } else {
    return uniqueArray(preds);
  }
}

export function getSuccessors(node, nodetype) {
  const dirSucs = getDirectSuccessor(node, nodetype);

  return getSucsOfType(dirSucs, nodetype, dir_sucs);
}

function getSucsOfType(to_check, nodetype, sucs) {
  let toCheck = to_check;
  let newCheck = [];

  for (let i = 0; i < toCheck.length; i++) {
    let dir_suc = getDirectSuccessor(toCheck[i], nodetype);

    for (let j = 0; j < dir_suc.length; j++) {
      sucs.push(dir_suc[j]);
      newCheck.push(dir_suc[j]);
    }
  }

  if (newCheck.length > 0) {
    return getSucsOfType(newCheck, nodetype, sucs);
  } else {
    return uniqueArray(sucs);
  }
}

function uniqueArray(input) {
  let result = [];

  for (let i = 0; i < input.length; i++) {
    let el = input[i];
    let unique = true;

    for (let j = 0; j < result.length; j++) {
      let check = result[j];
      if (el === check) {
        unique = false;
        break;
      }
    }

    if (unique) {
      result.push(el);
    } else {
      unique = true;
    }
  }

  return result;
}
