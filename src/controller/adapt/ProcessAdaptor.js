// contains functions to create alternative business processes
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development";
import ProjectModel from './../../models/ProjectModel';
import * as ProcessQuery from "../process/ProcessQuery";
import * as ProcessRenderer from "../process/ProcessRenderer";
import * as ProcessEditor from "../process/ProcessEditor";
import * as GraphQuery from "../graph/GraphQuery";
import * as AlternativeFinder from './AlternativeFinder';
import * as FileIo from './../../controller/helpers/fileio';
import * as InfraQuery from './../infra/InfraQuery';

async function getModeler(bpmnXml) {
  let promise = new Promise((res, rej) => {
    let modeler = new BpmnModeler();
    let process = null;
    modeler.importXML(bpmnXml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        process = ProcessQuery.getProcess(modeler);
        res(modeler);
      }
    });
  });

  // wait until the promise returns us a value
  return await promise;
}

async function adaptBusinessProcessByAlternatives(alternative) {
  let modeler = await getModeler(ProjectModel.getBpmnXml());
  const violatedNode = alternative.violatedCP;
  const altNode = alternative.alternative;
  const type = altNode.data('nodetype');
  const violatedShape = ProcessQuery.getShapeOfRegistry(modeler, violatedNode.data('cpid'));

  // 1. check whether alternative is process or pattern
  // 2. if alternative is pattern
  if (type === 'complianceprocesspattern') {
    ProcessEditor.defineAsComplianceProcess(modeler, violatedShape.businessObject, false);
    ProcessRenderer.colorShape(modeler, violatedShape, { stroke: 'grey', fill: 'none'} );
    ProcessEditor.defineAsComplianceProcessPattern(modeler, violatedShape.businessObject, true);
    ProcessRenderer.updateShape(modeler, violatedShape, {name: altNode.data('name')});
    removeDataInputShapes(modeler, violatedShape);
  }

  // 3. if alternative is process
  if (type === 'complianceprocess') {
    const triggerAlt = GraphQuery.getPropsValue(altNode.data('props'), 'trigger')[0];
    const triggerViolatedCP = GraphQuery.getPropsValue(violatedNode.data('props'), 'trigger')[0];

    if (triggerAlt === triggerViolatedCP) {
      ProcessRenderer.updateShape(modeler, violatedShape, {name: altNode.data('name')});
      removeDataInputShapes(modeler, violatedShape);
    } else {
      const predShape = ProcessQuery.getShapeOfRegistry(modeler, triggerAlt);
      insertShape(predShape, altNode, modeler);
      removeObsoleteShape(modeler, violatedShape);
    }
  }
  return FileIo.getXmlFromViewer(modeler);
}

function insertShape(predShape, altNode, viewer) {
  const posX = predShape.x + 300;
  const posY = predShape.y * 1.5;
  const sucs = ProcessQuery.getSucessorShapes(viewer, predShape);

  for (let i = sucs.length - 1; i >= 0; i--){
    ProcessRenderer.moveShape(viewer, sucs[i]);
  }

  const name = altNode.data('name');
  const type = altNode.data('nodetype');
  let newShape = ProcessRenderer.createShape(viewer, {
    x: posX, y: posY, type: 'bpmn:Task', name: name,
  });

  if (type === 'complianceprocess') {
    ProcessEditor.defineAsComplianceProcess(viewer, newShape.businessObject, true);
    ProcessRenderer.colorShape(viewer, newShape, { fill: 'grey' });
  } else if (type === 'complianceprocesspattern') {
    ProcessEditor.defineAsComplianceProcessPattern(viewer, newShape.businessObject, true);
  }
  ProcessRenderer.integrateShapeSequential(viewer, newShape, predShape, 'after');

  // add compliance requirements as data to the process model
  const nodeReq = GraphQuery.filterNodesByType(GraphQuery.getSuccessors(altNode), 'compliance')[0];
  ProcessRenderer.addExtensionShape(viewer, newShape, { compliance: nodeReq.data() });

  // add infra as dataStore to the process model
  if (altNode.data('props') !== null) {
    const reqs = GraphQuery.getPropsValue(altNode.data('props'), 'req');
    const infra = ProjectModel.getInfra();
    for (let i = 0; i < reqs.length; i++) {
      const infraElement = InfraQuery.getElementById(infra, reqs[i]);
      ProcessRenderer.addExtensionShape(viewer, newShape, {infra: infraElement});
    }
  }

}

function removeObsoleteShape(viewer, shape) {
  const sucs = ProcessQuery.getSucessorShapes(viewer, shape);
  const dataInputShapes = ProcessQuery.getDataInputShapes(viewer, shape);
  for (let j = 0; j < dataInputShapes.length; j++){
    const dataInputShape = dataInputShapes[j];
    ProcessRenderer.removeShape(viewer, dataInputShape);
  }
  ProcessRenderer.removeShape(viewer, shape);

  for (let j = sucs.length - 1; j >= 0; j--){
    ProcessRenderer.moveShape(viewer, sucs[j], 'left');
  }
}

function removeObsoleteShapes(viewer, shapeList) {
  for (let i = 0; i < shapeList.length; i++) {
    const shape = shapeList[i];
    removeObsoleteShape(viewer, shape);
  }
}

function removeDataInputShapes(viewer, shape) {
  // remove data input shapes expect the compliance requirement
  const dataInputShapes = ProcessQuery.getDataInputShapes(viewer, shape);
  for (let j = 0; j < dataInputShapes.length; j++){
    const dataInputShape = dataInputShapes[j];
    if (ProcessQuery.isExtensionShape(dataInputShape) && !ProcessQuery.isComplianceExtensionShape(dataInputShape)) {
      // remove extension entry in flow shape
      const extElements = ProcessQuery.getExtensionOfElement(dataInputShape.businessObject);
      for (let i = 0; i < extElements.length; i++) {
        if (extElements[i]._name === 'infra') {
          ProcessEditor.removeExt(shape.businessObject.extensionElements, { name: 'infra', value: extElements[i]._value });
        }
      }
      ProcessRenderer.removeShape(viewer, dataInputShape);
    }
  }
}

function getShapes(modeler, queryResult) {
  let shapes = [];

  for (let i = 0; i < queryResult.length; i++) {
    const element = queryResult[i].data();
    const shape = ProcessQuery.getShapeOfRegistry(modeler, element.id);
    if (shape !== undefined) {
      shapes.push(shape);
    }

    // test extension shapes
    const shapesOfProcess = ProcessQuery.getShapes(modeler);
    for (let j = 0; j < shapesOfProcess.length; j++) {
      const extShape = shapesOfProcess[j];
      const id = ProcessQuery.getIdFromExtensionShape(extShape);

      if (id === element.id) {
        if (extShape.type !== 'label'){
          const extBO = extShape.businessObject;
          if (ProcessQuery.isDataObject(extBO) || ProcessQuery.isDataStore(extBO)) {
            shapes.push(extShape);
          }
        }
      }
    }
  }
  return shapes;
}

export async function getAdaptedProcesses(altGraph, deleteGraph, bpmnXml){
  let adaptedProcesses = [];
  const violatedElements = GraphQuery.filterNodes(deleteGraph, { style: 'violated' });
  const obsoleteElements = GraphQuery.filterNodes(deleteGraph, { style: 'obsolete' });
  let modeler = await getModeler(bpmnXml);

  if (violatedElements.length === 0) {

    let obsoleteShapes = getShapes(modeler, obsoleteElements);
    const changedElement = GraphQuery.filterNodes(deleteGraph, { style: 'changedElement' });
    removeObsoleteShapes(modeler, obsoleteShapes);
    obsoleteShapes = getShapes(modeler, changedElement);
    removeObsoleteShapes(modeler, obsoleteShapes);
    adaptedProcesses.push({
      name: 'removed obsolete elements',
      bpmnXml: FileIo.getXmlFromViewer(modeler),
    });

  } else {
    const altEles = AlternativeFinder.getAlternatives(altGraph, deleteGraph, modeler);
    let violatedShapes = getShapes(modeler, violatedElements);
    const changedElement = GraphQuery.filterNodes(deleteGraph, { style: 'changedElement' });
    if (changedElement[0].data('nodetype') === 'complianceprocess') {
      violatedShapes.push(getShapes(modeler, changedElement)[0]);
    }
    // adapt process with alternatives
    for (let i = 0; i < altEles.length; i++) {
      const altEle = altEles[i];
      const bpmnXml = await adaptBusinessProcessByAlternatives(altEle);
      let name = 'alternative process ' + (i + 1);
      adaptedProcesses.push({
        name: name,
        bpmnXml: bpmnXml,
      });
    }
  }
  return adaptedProcesses;
}
