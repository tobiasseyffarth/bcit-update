// contains functions to create alternative business processes

import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development";
import ProjectModel from './../../models/ProjectModel';
import * as ProcessQuery from "../process/ProcessQuery";
import * as ProcessRenderer from "../process/ProcessRenderer";
import * as ProcessEditor from "../process/ProcessEditor";
import * as GraphQuery from "../graph/GraphQuery";
import * as AlternativeFinder from './AlternativeFinder';
import * as FileIo from './../../controller/helpers/fileio';

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
  const violated = alternative.violatedCP;
  const altNode = alternative.alternative;
  const type = altNode.data('nodetype');

  // 1. check whether alternative is process or pattern

  // 2. if alternative is pattern
  // get direct successor of violated cp
  // remove violatedCP
  // --> integration point of the pattern is the integration point of violatedCP

  /*
  for (let i = 0; i < violatedShapes.length; i++) {
    const shape = violatedShapes[i];
    if (ProcessQuery.isCompliance(shape.businessObject)){
      // get direct predecessor

      // remove Element
      removeObsoleteShape(viewer, shape);
    }
  }
  */

  // 3. if alternative is process
  if (type === 'complianceprocess') {
    const trigger = GraphQuery.getPropsValue(altNode.data('props'), 'trigger')[0];
    const predShape = ProcessQuery.getShapeOfRegistry(modeler, trigger);
    const violatedShape = ProcessQuery.getShapeOfRegistry(modeler, violated.data('cpid'));
    insertShape(predShape, altNode, modeler);
    removeObsoleteShape(modeler, violatedShape);
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

  //todo: hier ext Elements Data und DataStore einbauen
  const nodeReq = GraphQuery.filterNodesByType(GraphQuery.getSuccessors(altNode), 'compliance')[0];
  console.log('node requirement', nodeReq);

  const req = GraphQuery.getPropsValue(altNode.data('props'), 'req');
  console.log('further requirements', req);
}

function removeObsoleteShape(viewer, shape) {
  const sucs = ProcessQuery.getSucessorShapes(viewer, shape);
  console.log('sucs des violated shape', sucs);

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
