// contains functions to create alternative business processes

import * as ProcessQuery from "../process/ProcessQuery";
import * as ProcessRenderer from "../process/ProcessRenderer";
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development";
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

function adaptBusinessProcessByAlternatives(viewer, violatedCPShape, alternative) {

  // check whether alternative is process or pattern

  // if pattern
  // get direct successor of violated cp
  // remove violatedCP
  // --> integration point of the pattern is the integration point of violatedCP

  // if process
  // --> get trigger of process
  // integrate after ce


  const bpmnXml = FileIo.getXmlFromViewer(viewer);
  return bpmnXml;
}

function removeObsoleteElements(viewer, shapeList) {

  for (let i = 0; i < shapeList.length; i++) {
    const shape = shapeList[i];
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
  const modeler = await getModeler(bpmnXml);

  if (violatedElements.length === 0) {
    let obsoleteShapes = getShapes(modeler, obsoleteElements);
    const changedElement = GraphQuery.filterNodes(deleteGraph, { style: 'changedElement' });
    removeObsoleteElements(modeler, obsoleteShapes);
    obsoleteShapes = getShapes(modeler, changedElement);
    removeObsoleteElements(modeler, obsoleteShapes);
    adaptedProcesses.push({
      name: 'removed obsolete elements',
      bpmnXml: FileIo.getXmlFromViewer(modeler),
    });
  } else {
    const altEles = AlternativeFinder.getAlternatives(altGraph, deleteGraph);

    // adapt process with alternatives
    for (let i = 0; i < altEles; i++) {
      const altEle = altEles[i];
      const violatedShapes = getShapes(modeler, violatedElements);
      const altBpmnXml = adaptBusinessProcessByAlternatives(modeler, violatedShapes, altEle);
      adaptedProcesses.push({
        name: 'alternative process', i,
        bpmnXml: altBpmnXml,
      });
    }
  }

  return adaptedProcesses;
}
