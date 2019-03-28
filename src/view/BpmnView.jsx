import React, {Component} from 'react';
import BpmnModeler from "bpmn-js/dist/bpmn-modeler.development";
import BpmnPanel from './BpmnPanel';

import ProjectModel from './../models/ProjectModel';
import processquery from './../controller/processquery';

class BPMN extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.bpmnModeler = new BpmnModeler({
            container: "#canvas"
        });
        this.hookEventBus();

        if (ProjectModel.getBpmnXml() !== null) {
            this.renderDiagram(ProjectModel.getBpmnXml());
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.bpmnXml !== this.props.bpmnXml) {
            this.renderDiagram(nextProps.bpmnXml);
        }
    }

    renderDiagram = (xml) => {
        this.bpmnModeler.importXML(xml, err => {
            if (err) {
                console.log("error rendering", err);
            } else {
                //todo:
                //Layout des Canvas
                ProjectModel.setViewer(this.bpmnModeler);
                let process = processquery.getProcess(this.bpmnModeler);
                ProjectModel.setProcess(process);
            }
        });
    };

    hookEventBus() {
        let eventBus = this.bpmnModeler.get('eventBus');
        eventBus.on('element.click', (e) => this.hookOnClick(e));
    }

    hookOnClick(e) {
        let element = e.element;
        this.setState({element: element});
        let process = ProjectModel.getProcess();
        console.log(process);
    }

    render() {
        return (
            <div className="content">
                <div id="canvas"/>
                <BpmnPanel element={this.state.element}></BpmnPanel>
            </div>
        );
    }
}

export default BPMN;