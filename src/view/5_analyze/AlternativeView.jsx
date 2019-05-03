import React, { Component } from 'react';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import '../../App.css';
import ProjectModel from '../../models/ProjectModel';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.development';

class AlternativeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alternativeProcess: [
        { name: 'alternative 1' },
        { name: 'alternative 2' },
      ],
      visibleAlternative: false,
    };
    this.renderAlternativeProcess = this.renderAlternativeProcess.bind(this);
    this.onHide = this.onHide.bind(this);
  }

  componentDidMount() {
    this.bpmnAltModeler = new BpmnModeler({
      container: '#alternative',
      height: '350px',
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({ visibleAlternative: nextProps.showAlternative });
  }

  onHide() {
    this.props.close();
    this.setState({ visibleAlternative: false });
  }

  onShow() {
    if (ProjectModel.getBpmnXml() !== null) {
      this.renderBpmn(ProjectModel.getBpmnXml());
    }
  }

  renderBpmn = (xml) => {
    this.bpmnAltModeler.importXML(xml, (err) => {
      if (err) {
        console.log('error rendering', err);
      } else {
        const canvas = this.bpmnAltModeler.get('canvas');
        canvas.zoom('fit-viewport');
      }
    });
  };

  renderAlternativeProcess(option) {
    console.log(option);
  }

  render() {
    const footer = (
      <div>
        <Button label="close" onClick={this.onHide} />
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header="Alternative Processes"
          footer={footer}
          visible={this.state.visibleAlternative}
          style={{ width: '80vw' }}
          onHide={this.onHide}
          onShow={() => this.onShow()}
          maximizable
        >
          <section className="container-process">
            <div className="viewer" style={{ width: '60vw', height: '400px' }}>
              <div id="alternative" />
            </div>
            <div className="property-panel">
              <ListBox
                style={{ width: '100%' }}

              />
            </div>
          </section>
        </Dialog>
      </div>
    );
  }
}

export default AlternativeView;
