class Project {
  constructor() {
    this.project = null; // Project File

    this.BpmnXml = null; // content as String
    this.viewer = null; // Bpmn viewer

    this.infra = null; // infrastructure
    this.compliance = null; // compliance
    this.graph = null; // create an empty graph and define its style

    this.altGraph = null; // contains relations between req, cp-pattern and cp
  }

  setName = (name) => {
    this.name = name;
  };
  getName = () => this.name;

  setBpmnXml = (BpmnXml) => {
    this.BpmnXml = BpmnXml;
  };
  getBpmnXml = () => this.BpmnXml;

  setViewer = (viewer) => {
    this.viewer = viewer;
  };
  getViewer = () => this.viewer;

  setInfra = (infra) => {
    this.infra = infra;
  };
  getInfra = () => this.infra;

  setCompliance = (compliance) => {
    this.compliance = compliance;
  };
  getCompliance = () => this.compliance;

  setGraph = (graph) => {
    this.graph = graph;
  };
  getGraph = () => this.graph;

  setAltGraph = (altGraph) => {
    this.altGraph = altGraph;
  };
  getAltGraph = () => this.altGraph;
}

const ProjectModel = new Project();
module.exports = ProjectModel;
