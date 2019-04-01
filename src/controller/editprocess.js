import BpmnModdle from 'bpmn-moddle';

//final
function addElements(viewer, process) {

  //https://github.com/bpmn-io/bpmn-moddle/blob/master/test/spec/xml/edit.js
  //https://github.com/bpmn-io/bpmn-moddle/blob/master/test/spec/xml/write.js
  let moddle = viewer.get('moddle'); // Moddle verändert das Datenmodell
  let dataObject = moddle.create('bpmn:DataObject', {id: 'dataObject_2'}); // mit moddle.create können beliebige BPMN-Objekte erzeugt werden
  let database = moddle.create('bpmn:DataStore', {id: 'dataStore_2'});

  let task = moddle.create('bpmn:Task', {id: 'task_2', name: 'name'});

  // neue Objekte müssen an das Parent-Element gehangen werden

  task.dataObjectRef = dataObject;
  task.dataStoreRef = database;

  task.$parent = process;
  dataObject.$parent = process;
  database.$parent = process;

  process.flowElements.push(task);
  process.flowElements.push(dataObject);
  process.flowElements.push(database);

}

function addExtension(viewer, element, extension) {
  let moddle = viewer.get('moddle'); // Moddle verändert das Datenmodell
  let extensionElements = moddle.create('bpmn:ExtensionElements'); //moddle.create('bpmn:DataObject', {id: 'dataObject_2'}); // mit moddle.create können beliebige BPMN-Objekte erzeugt werden

  if (element.extensionElements === undefined) { //todo: bestehende Extension updaten
    element.extensionElements = extensionElements;
  }

  element.extensionElements.get('values').push(extension);
}

//final
function createExtensionElement(name, value) {
  let moddle = new BpmnModdle();

  let extension = moddle.createAny('vendor:foo', 'http://vendor', {
    name: name,
    value: value
  });
  return extension;
}

//final
export function removeExt(extensionElements, option) {
  let ext = extensionElements.get('values');
  let name = option.name;
  let value = option.value;
  let removeExt = option.remove;
  let no;

  if (removeExt == null) {
    for (let i = 0; i < ext.length; i++) {
      if (ext[i].name === name && ext[i].value === value) {
        ext.splice(i, 1);
        break;
      }
    }
  } else {
    for (let i = 0; i < ext.length; i++){
      if (ext[i] === removeExt){
        no = i;
        break;
      }
    }
    ext.splice(no, 1);
  }
}

//remove flowelement from repo and shape
function removeFlowelement(){

}

//final
function defineAsComplianceProcess(viewer, element, status) {
  if (status === true) { //if element shall be set as a compliance process
    let extension = createExtensionElement('isComplianceProcess', 'true');
    addExtension(viewer, element, extension);
  } else { //undo a set compliance process
    removeExt(element.extensionElements, {name: 'isComplianceProcess', value: 'true'});
  }
}

//final
function definition2xml(definitions) {
  let moddle = new BpmnModdle();
  let xml;
  moddle.toXML(definitions, function (err, xmlStrUpdated) {
    xml = xmlStrUpdated;
  });
}
