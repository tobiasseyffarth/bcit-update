class Project {
    constructor() {
        this.name = 'Test'; //Project name
        this.project = null; //Project File

        this.BpmnXml = null; //content as String
        this.process = null; //process file
        this.viewer = null; //Bpmn viewer

        this.infra = null; //infrastructure
        this.graph = null; //global graph
        this.compliance = null; //compliance
    }

    setName = (name) => {
        this.name = name;
    };
    getName = () => this.name;

    setProcess = (process) => {
        this.process = process;
    };
    getProcess = () => this.process;

    setBpmnXml = (BpmnXml) => {
        this.BpmnXml = BpmnXml;
    };
    getBpmnXml = () => this.BpmnXml;

    setViewer = (viewer) => {
        this.viewer = viewer;
    };
    getViewer = () => this.viewer;
}

const ProjectModel = new Project();
module.exports = ProjectModel;
