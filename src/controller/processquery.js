// final
function getElement(viewer, e) {
  return e.element;
}

function getDirectPredecessor(element) {

}

function getDirectSucessor(element) {

}

// Überladen, wenn eingabe einmal der Viewer und einmal ein Node ist??
function getProcess(viewer, e) {
  if (e === null) {
    const elementRegistry = viewer.get('elementRegistry');
    let nodes = [];
    nodes = elementRegistry.getAll();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].businessObject.$type === 'bpmn:Process') {
        return nodes[i].businessObject;
      }
    }
  } else {
    const elementRegistry = viewer.get('elementRegistry');
    const nodeElement = elementRegistry.get(e.element.id);
    const node = nodeElement.businessObject;
    return elementRegistry.get(node.$parent.id);
  }
}

// final
function getElementOfRegistry(viewer, id) {
  const elementRegistry = viewer.get('elementRegistry');
  const element = elementRegistry.get(id);

  return element.businessObject;
}

// final
function getFlowElementsOfProcess(process) {
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
function getFlowNodesOfProcess(process) {
  let flowElements = [];
  const nodes = [];

  flowElements = getFlowElementsOfProcess(process);

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
function getSequenceFlowsofProcess(process) {
  let flowElements = [];
  const sequence = [];

  flowElements = getFlowElementsOfProcess(process);

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
function getFlowElementById(process, id) {
  let flowElements = [];
  flowElements = getFlowElementsOfProcess(process);

  for (let i = 0; i < flowElements.length; i++) {
    if (flowElements[i].id === id) {
      return flowElements[i];
    }
  }
  return null;
}

// final
function getExtensionOfElement(element) {
  let extensionElements = [];
  const result = [];
  let _name;
  let _value;

  if (element.extensionElements !== undefined) {
    extensionElements = element.extensionElements.values;

    for (let i = 0; i < extensionElements.length; i++) {
      if (extensionElements[i].$children !== undefined) { // get camunda extension
        for (let j = 0; j < extensionElements[i].$children.length; j++) {
          _name = extensionElements[i].$children[j].name;
          _value = extensionElements[i].$children[j].value;
          result.push({ _name, _value });
        }
      } else { // get own extension
        _name = extensionElements[i].name;
        _value = extensionElements[i].value;
        result.push({ _name, _value });
      }
    }

    return result;
  }
}

function hasExtension(element, name, value) {
  const props = getExtensionOfElement(element);

  if (value === undefined) {
    for (let i = 0; i < props.length; i++) { // check if the element has an extension of name
      if (props[i].name === name) {
        return true;
      }
    }
  } else {
    for (let i = 0; i < props.length; i++) { // check if the node is a compliance process
      if (props[i].name === name && props[i].value === value) {
        return true;
      }
    }
  }

  return false;
}

// final
function isCompliance(element) {
  const name = 'isComplianceProcess';
  const value = 'true';

  return hasExtension(element, name, value);
}

// final
function hasExtensionName(element, name) {
  const props = getExtensionOfElement(element);
  for (let i = 0; i < props.length; i++) { // check if the element has an extension of name
    if (props[i].name === name) {
      return true;
    }
  }
  return false;
}


function isExtensionShape(shape) {
  const element = shape.businessObject;
  return hasExtension(element, 'flowelement');
}

// final
function isFlowElement(option) { // identify flowNodes
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
function isDataObject(option) { // identify Database or Document
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

  return (type.includes('data'));
}

function isDataStore(option) {
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

  return (type.includes('datastore'));
}

function isDataObjectRef(option) {
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
function isUniqueExtension(viewer, element, extension) {
  if (element.extensionElements === undefined) {
    return true;
  }
  const ext = element.extensionElements.get('values');
  for (let i = 0; i < ext.length; i++) {
    if (ext[i].name === extension.name && ext[i].value === extension.value) {
      return false;
    }
  }

  return true;
}

// final
function getIdFromExtensionShape(shape) {
  const element = shape.businessObject;
  const shapeExtension = getExtensionOfElement(element);

  for (let i = 0; i < shapeExtension.length; i++) {
    const { name } = shapeExtension[i];
    const { value } = shapeExtension[i];
    if (name !== 'flowelement') {
      return value;
    }
  }
}

function isTaskOrSubprocess(input) {
  const { element } = input;
  const { shape } = input;
  let { type } = null;

  if (element !== null) {
    type = element.$type;
  }

  if (shape !== null) {
    type = shape;
  }

  type = type.toLowerCase();
  return (type.includes('task') || type.includes('subprocess'));
}

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
