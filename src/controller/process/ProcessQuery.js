/*
// final
function getElement(viewer, e) {
  return e.element;
}
*/

export function getProcess(viewer, e) {
  let process;

  if (e === null || e === undefined) {
    const elementRegistry = viewer.get('elementRegistry');
    const nodes = elementRegistry.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].businessObject.$type === 'bpmn:Process') {
        process = nodes[i].businessObject;
        break;
      }
    }
  } else {
    const elementRegistry = viewer.get('elementRegistry');
    const nodeElement = elementRegistry.get(e.element.id);
    const node = nodeElement.businessObject;
    process = elementRegistry.get(node.$parent.id);
  }

  return process;
}

// final
export function getElementOfRegistry(viewer, id) {
  const elementRegistry = viewer.get('elementRegistry');
  const element = elementRegistry.get(id);

  return element.businessObject;
}

// final
export function getFlowElementsOfProcess(process) {
  const flowElements = [];

  if (process.flowElements === undefined) {
    return null;
  }
  for (let i = 0; i < process.flowElements.length; i++) {
    flowElements.push(process.flowElements[i]);
  }

  return flowElements;
}

// final
export function getFlowNodesOfProcess(process) {
  const flowElements = getFlowElementsOfProcess(process);
  const nodes = [];

  if (flowElements != null) {
    for (let i = 0; i < flowElements.length; i++) {
      if (!flowElements[i].$type.includes('SequenceFlow')) {
        nodes.push(flowElements[i]);
      }
    }
    return nodes;
  }
  return null;
}

// final
export function getSequenceFlowsofProcess(process) {
  const flowElements = getFlowElementsOfProcess(process);
  const sequence = [];

  if (flowElements != null) {
    for (let i = 0; i < flowElements.length; i++) {
      if (flowElements[i].$type.includes('SequenceFlow')) {
        sequence.push(flowElements[i]);
      }
    }
    return sequence;
  }
  return null;
}

// final
export function getFlowElementById(process, id) {
  const flowElements = getFlowElementsOfProcess(process);

  for (let i = 0; i < flowElements.length; i++) {
    if (flowElements[i].id === id) {
      return flowElements[i];
    }
  }
  return null;
}

// final
export function getFlowNodeByType(process, type) {
  const result = [];
  const nodes = getFlowNodesOfProcess(process);

  for (let i = 0; i < nodes.length; i++) {
    const _type = nodes[i].$type;
    if (_type === type) {
      result.push(nodes[i]);
    }
  }
  return result;
}

// final
export function getExtensionOfElement(businessObject) {
  let extensionElements = [];
  const result = [];
  let _name;
  let _value;

  if (businessObject.extensionElements !== undefined) {
    if (businessObject.extensionElements.values !== undefined) {
      extensionElements = businessObject.extensionElements.values;
      for (let i = 0; i < extensionElements.length; i++) {
        if (extensionElements[i].$children !== undefined) { // get camunda extension
          for (let j = 0; j < extensionElements[i].$children.length; j++) {
            _name = extensionElements[i].$children[j].name;
            _value = extensionElements[i].$children[j].value;
            result.push({ name: `${_name} ${_value}`, _name, _value });
          }
        } else { // get own extension
          _name = extensionElements[i].name;
          _value = extensionElements[i].value;
          result.push({ name: `${_name} ${_value}`, _name, _value });
        }
      }
    }
  }
  return result;
}

export function hasExtension(businessObject, name, value) {
  const props = getExtensionOfElement(businessObject);

  if (props !== undefined) {
    if (value === undefined) {
      for (let i = 0; i < props.length; i++) { // check if the element has an extension of name
        if (props[i]._name === name) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < props.length; i++) { // check if the node is a compliance process
        if (props[i]._name === name && props[i]._value === value) {
          return true;
        }
      }
    }
  }

  return false;
}

// final
export function isCompliance(element) {
  const name = 'isComplianceProcess';
  const value = 'true';

  return hasExtension(element, name, value);
}

// final
export function hasExtensionName(businessObject, name) {
  const props = getExtensionOfElement(businessObject);
  for (let i = 0; i < props.length; i++) { // check if the element has an extension of name
    if (props[i].name === name) {
      return true;
    }
  }
  return false;
}

export function isExtensionShape(element) {
  const { businessObject } = element;
  return hasExtension(businessObject, 'flowelement');
}

// final
export function isFlowElement(option) { // identify flowNodes
  const { element } = option;
  const { shape } = option;
  let { type } = null;

  if (element != null) {
    type = element.$type;
  }

  if (shape != null) {
    type = shape;
  }

  type = type.toLowerCase();
  return ((!type.includes('data')) && (!type.includes('sequence')));
}

// final
export function isDataObject(businessObject) { // identify Database or Document
  return (businessObject.$type.includes('DataObject'));
}

export function isDataStore(businessObject) {
  return (businessObject.$type.includes('DataStore'));
}

export function isDataObjectRef(option) {
  const { element } = option;
  const { shape } = option;
  let type = null;

  if (element !== null) {
    type = element.$type;
  }

  if (shape != null) {
    type = shape;
  }

  type = type.toLowerCase();

  return (type.includes('dataobject'));
}

// final
export function isUniqueExtension(businessObject, extension) {
  if (businessObject.extensionElements === undefined) {
    return true;
  }
  const ext = businessObject.extensionElements.get('values');
  for (let i = 0; i < ext.length; i++) {
    if (ext[i].name === extension.name && ext[i].value === extension.value) {
      return false;
    }
  }

  return true;
}

// final
export function getIdFromExtensionShape(element) {
  const { businessObject } = element;
  const shapeExtension = getExtensionOfElement(businessObject);

  for (let i = 0; i < shapeExtension.length; i++) {
    const { name } = shapeExtension[i];
    const { value } = shapeExtension[i];
    if (name !== 'flowelement') {
      return value;
    }
  }

  return null;
}

export function isTaskOrSubprocess(input) {
  let { type } = input;
  type = type.toLowerCase();
  return (type.includes('task') || type.includes('subprocess'));
}

// final
function getSucessors(flownode) {
  const result = [];

  if (flownode.outgoing !== undefined) {
    const { outgoing } = flownode;

    for (let i = 0; i < outgoing.length; i++) {
      result.push(outgoing[i].targetRef);
    }
    return result; // array of flownodes
  }
  return null;
}

// testen
function getPredecessors(flownode) {
  const result = [];

  if (flownode.incoming !== undefined) {
    const { incoming } = flownode;

    for (let i = 0; i < incoming.length; i++) {
      result.push(incoming[i].sourceRef);
    }
    return result;
  }
  return null;
}

/*
// todo: testen mit Parallelitäten in Parallität und Exklusivität
function getParallelTrace(node, parallelTrace) {
  const sucs = getSucessors(node);

  if (parallelTrace === undefined) {
    const _parallelTrace = [];

    for (let i = 0; i < sucs.length; i++) {
      const sequence = [];
      _parallelTrace.push({ status: 'open', sequence });
    }
    return getParallelTrace(node, _parallelTrace);
  }
  let finished = true;
  const _parallelTrace = [];

  for (let i = 0; i < parallelTrace.length; i++) {
    const _trace = parallelTrace[i];
    // console.log('trace', _trace);

    if (_trace.status === 'open') {
      finished = false;
      let _node;
      let suc;

      if (_trace.sequence.length === 0) {
        _node = node;
        suc = getSucessors(_node)[i];
      } else {
        _node = _trace.sequence[_trace.sequence.length - 1];
        suc = getSucessors(_node)[0];
      }

      if (suc.$type === 'bpmn:ParallelGateway') {
        if (getSucessors(node).length === getPredecessors(suc).length) {
          _trace.status = 'closed';
        } else {
          // let trace = getParallelTrace(_node);
        }
      } else if (_node.$type === 'bpmn:ExclusiveGateway') {
        // todo: weiter bauen
        console.log('test');
      } else {
        _trace.sequence.push(suc);
      }
    }
    _parallelTrace.push(_trace);
  }

  if (finished) {
    return parallelTrace;
  }
  return getParallelTrace(node, _parallelTrace);
}

// todo: testen
function searchTrace(openTraces, finalTraces, endNode) {
  const help = []; // openTraces
  const _finalTraces = finalTraces;

  for (let i = 0; i < openTraces.length; i++) {
    const openTrace = openTraces[i];
    const node = openTrace[openTrace.length - 1];
    const sucs = getSucessors(node);

    if ((node.$type === 'bpmn:ExclusiveGateway')) {
      for (let j = 0; j < sucs.length; j++) {
        const newTrace = [];
        Array.prototype.push.apply(newTrace, openTrace);
        newTrace.push(sucs[j]);
        help.push(newTrace);
      }
    } else if ((node.$type === 'bpmn:ParallelGateway')) {
      for (let j = 0; j < sucs.length; j++) {
        const parallelTrace = getParallelTrace(node);
        Array.prototype.push.apply(openTrace, parallelTrace);
      }

      const closingParallel = getSucessors(openTrace[openTrace.length - 1].sequence[0])[0];
      openTrace.push(closingParallel);
      const suc = getSucessors(closingParallel)[0];
      openTrace.push(suc);
      help.push(openTrace);
    } else if (node === endNode) {
      _finalTraces.push(openTrace);
    } else {
      for (let j = 0; j < sucs.length; j++) {
        openTrace.push(sucs[j]);
      }
      help.push(openTrace);
    }
  }

  if (help.length === 0) {
    return _finalTraces;
  }
  return searchTrace(help, _finalTraces, endNode);
}

// todo: testen
function getTraces(process) {
  const finalTraces = [];
  const openTraces = [];
  const trace = [];

  const startNode = getFlowNodeByType(process, 'bpmn:StartEvent')[0];
  const endNode = getFlowNodeByType(process, 'bpmn:EndEvent')[0];

  trace.push(startNode);
  openTraces.push(trace);

  return searchTrace(openTraces, finalTraces, endNode);
}
*/

/*
module.exports = {
  getElement,
  getProcess,
  getElementOfRegistry,
  getFlowElementsOfProcess,
  getFlowNodesOfProcess,
  getSequenceFlowsofProcess,
  getFlowElementById,
  getExtensionOfElement,
  isCompliance,
  hasExtensionName,
  hasExtension,
  isUniqueExtension,
  isFlowElement,
  isDataObject,
  isExtensionShape,
  getIdFromExtensionShape,
  isDataObjectRef,
  isDataStore,
  isTaskOrSubprocess,
};
*/
