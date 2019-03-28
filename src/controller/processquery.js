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
  if (e == null) {
    const elementRegistry = viewer.get('elementRegistry');
    let nodes = [];
    nodes = elementRegistry.getAll();
    // console.log(nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].businessObject.$type == 'bpmn:Process') {
        return nodes[i].businessObject;
      }
    }
  } else {
    const elementRegistry = viewer.get('elementRegistry');
    const nodeElement = elementRegistry.get(e.element.id);
    const node = nodeElement.businessObject;
    const process = elementRegistry.get(node.$parent.id);

    return process;
  }
}

// final
function getElementOfRegistry(viewer, id) {
  const elementRegistry = viewer.get('elementRegistry');
  const element = elementRegistry.get(id);

  return element.businessObject;
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
function getFlowElementsOfProcess(process) {
  const flowElements = [];

  if (process.flowElements == undefined) {
    return null;
  }
  for (let i = 0; i < process.flowElements.length; i++) {
    flowElements.push(process.flowElements[i]);
  }

  return flowElements;
}

// final
function getFlowElementById(process, id) {
  let flowElements = [];
  flowElements = getFlowElementsOfProcess(process);

  for (let i = 0; i < flowElements.length; i++) {
    if (flowElements[i].id == id) {
      return flowElements[i];
    }
  }
  return null;
}

// final
function getExtensionOfElement(element) {
  let extensionElements = [];
  const result = [];
  let name;
  let value;

  if (element.extensionElements != undefined) {
    extensionElements = element.extensionElements.values;

    for (const i in extensionElements) {
      if (extensionElements[i].$children != undefined) { // get camunda extension
        console.log('camunda extension');
        console.log(extensionElements[i]);
        for (const j in extensionElements[i].$children) {
          name = extensionElements[i].$children[j].name;
          value = extensionElements[i].$children[j].value;
          result.push({ name, value });
        }
      } else { // get own extension
        name = extensionElements[i].name;
        value = extensionElements[i].value;
        result.push({ name, value });
      }
    }

    return result;
  }
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
  for (const j in props) { // check if the element has an extension of name
    if (props[j].name == name) {
      return true;
    }
  }
  return false;
}

function isExtensionShape(shape) {
  const element = shape.businessObject;
  return hasExtension(element, 'flowelement');
}

function hasExtension(element, name, value) {
  const props = getExtensionOfElement(element);

  if (value == undefined) {
    for (const j in props) { // check if the element has an extension of name
      if (props[j].name == name) {
        return true;
      }
    }
  } else {
    for (const j in props) { // check if the node is a compliance process
      if (props[j].name == name && props[j].value == value) {
        return true;
      }
    }
  }

  return false;
}

// final
function isFlowElement(option) { // identify flowNodes
  const element = option.element;
  const shape = option.shape;
  let type;

  if (element != null) {
    type = element.$type;
  }

  if (shape != null) {
    type = shape.type;
  }

  type = type.toLowerCase();

  if ((!type.includes('data')) && (!type.includes('sequence'))) {
    return true;
  }
  return false;
}

// final
function isDataObject(option) { // identify Database or Document
  const element = option.element;
  const shape = option.shape;
  let type;

  if (element != null) {
    type = element.$type;
  }

  if (shape != null) {
    type = shape.type;
  }

  type = type.toLowerCase();

  if (type.includes('data')) {
    return true;
  }
  return false;
}

function isDataStore(option) {
  const element = option.element;
  const shape = option.shape;
  let type;

  if (element != null) {
    type = element.$type;
  }

  if (shape != null) {
    type = shape.type;
  }

  type = type.toLowerCase();

  if (type.includes('datastore')) {
    return true;
  }
  return false;
}

function isDataObjectRef(option) {
  const element = option.element;
  const shape = option.shape;
  let type;

  if (element != null) {
    type = element.$type;
  }

  if (shape != null) {
    type = shape.type;
  }

  type = type.toLowerCase();

  if (type.includes('dataobject')) {
    return true;
  }
  return false;
}

// final
function isUniqueExtension(viewer, element, extension) {
  if (element.extensionElements == undefined) {
    return true;
  }
  const ext = element.extensionElements.get('values');
  for (let i = 0; i < ext.length; i++) {
    if (ext[i].name == extension.name && ext[i].value == extension.value) {
      return false;
      break;
    }
  }

  return true;
}

// final
function getIdFromExtensionShape(shape) {
  const element = shape.businessObject;
  const shapeExtension = getExtensionOfElement(element);

  for (const j in shapeExtension) {
    const name = shapeExtension[j].name;
    const value = shapeExtension[j].value;
    if (name != 'flowelement') {
      return value;
    }
  }
}

function isTaskOrSubprocess(input) {
  const element = input.element;
  const shape = input.shape;
  let type;

  if (element != null) {
    type = element.$type;
  }

  if (shape != null) {
    type = shape.type;
  }

  type = type.toLowerCase();

  if (type.includes('task') || type.includes('subprocess')) {
    return true;
  }
  return false;
}
