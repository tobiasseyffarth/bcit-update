import cytoscape from 'cytoscape';
import * as GraphCreator from './GraphEditor';
import * as InfraQuery from './../infra/InfraQuery';
import * as ProcessQuery from './../process/ProcessQuery';
import * as ProcessEditor from './../process/ProcessEditor';
import * as ProcessRenderer from './../process/ProcessRenderer';
import ProjectModel from '../../models/ProjectModel';

export function addSubGraphs(options) {
  const { process } = options;
  const { infra } = options;
  let graph = ProjectModel.getGraph();

  if (graph === null){
    graph = cytoscape({
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#ffffff',
            'border-style': 'solid',
            'border-color': '#666',
            'border-width': 1,
            label: 'data(id)',
            'font-size': 10,
            'text-wrap': 'wrap',
            'text-max-width': 20,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1,
            'line-color': '#666',
            'mid-target-arrow-color': '#666',
            'mid-target-arrow-shape': 'triangle',
            'line-style': 'dotted',
          },
        },
      ],
      layout: {
        name: 'grid',
        rows: 1,
      },
    });
  }

  if (process !== undefined) {
    GraphCreator.createGraphFromProcess(graph, process);
  } else if (infra !== undefined) {
    GraphCreator.createGraphFromInfra(graph, infra);
  }

  ProjectModel.setGraph(graph);
}

export function linkRequirement2Process(viewer, graph, shape, requirement) {
  const { businessObject } = shape;
  const extension = ProcessEditor.createExtensionElement('compliance', requirement.id);
  const isUniqueExt = ProcessQuery.isUniqueExtension(viewer, businessObject, extension);

  if (isUniqueExt) {
    ProcessEditor.addExtension(viewer, businessObject, extension); // 1. zu props flowelement hinzufügen
    GraphCreator.updateFlownodeProperty(graph, businessObject); // 3. graph in graphviewer updaten
    GraphCreator.addNodes(graph, { requirement, businessObject }); // 4. create and link nodes
    ProcessRenderer.addExtensionShape(viewer, shape, { compliance: requirement }, extension); // 5. add DataObject to process model
  }
}

export function linkInfra2Process(viewer, graph, shape, itComponent) {
  const { businessObject } = shape;

  if (!businessObject.$type.toLowerCase().includes('data')) {
    const extension = ProcessEditor.createExtensionElement('infra', itComponent.id);
    const isUniqueExt = ProcessQuery.isUniqueExtension(viewer, businessObject, extension);

    if (isUniqueExt) {
      ProcessEditor.addExtension(viewer, businessObject, extension); // 1. zu props flowelement hinzufügen
      GraphCreator.updateFlownodeProperty(graph, businessObject); // 2. graph in graphviewer updaten
      GraphCreator.addNodes(graph, { itComponent, businessObject }); // 3. create and link nodes
      ProcessRenderer.addExtensionShape(viewer, shape, { infra: itComponent }, extension); // 4. add DataObject to process model
    }
  }
}

export function linkRequirement2Requirement(graph, source_requirement, target_requirement) {
  GraphCreator.addNodes(graph, { requirement: source_requirement, requirement_2: target_requirement });
}

export function linkRequirement2Infra(graph_viewer, infraViewer, requirement, itcomponent) {
  const graph_infra = infraViewer.graph;

  if (itcomponent != null) {
    const isUniqueProp = InfraQuery.isUniqueProp(itcomponent, { requirement });
    if (isUniqueProp) { // if new Props are added
      InfraQuery.updateITProps(itcomponent, { requirement });// 1. zu props infra hinzufügen
      GraphCreator.updateITComponentProperty(graph_infra, itcomponent);// 2. Graph in infraviewer updaten
      infraViewer.renderITProps(); // 3. infraprops neu rendern
      GraphCreator.updateITComponentProperty(graph_viewer, itcomponent); // 4. graph in graphviewer updaten
      GraphCreator.addNodes(graph_viewer, { requirement, itcomponent }); // 5. create and link nodes
      GraphCreator.updateITDisplayName(graph_viewer, graph_infra, itcomponent); // 6. update Displayname IT Component
    }
  }
}

export function updateITComponent(graph, itComponent) {
  const graphViewer = graph.graph_viewer;
  const graphInfra = graph.graph_infra;

  GraphCreator.updateITComponentProperty(graphViewer, itComponent); // update node.data('props')
  GraphCreator.updateNeighborsBasedOnProps(graphViewer, itComponent); // remove edges
  GraphCreator.updateITDisplayName(graphViewer, graphInfra, itComponent); // update Displayname IT Component
}

export function updateFlowelement(viewer, graph, flowelement) {
  GraphCreator.updateFlownodeProperty(graph, flowelement);
  GraphCreator.updateComplianceNode(graph, flowelement);
  GraphCreator.updateNeighborsBasedOnProps(graph, flowelement);
  ProcessRenderer.removeExtensionShape(viewer, flowelement);
}
