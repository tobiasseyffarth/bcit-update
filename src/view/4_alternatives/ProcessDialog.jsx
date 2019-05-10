import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import '../../App.css';

class ProcessDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: 'Create new compliance process',
      mode: 'add',
      process: null,
      processName: null,
      processRule: null,
      processProps: null,
      visibleDialog: false,
    };

    this.onShow = this.onShow.bind(this);
    this.onHide = this.onHide.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ visibleDialog: nextProps.showComplianceProcessDialog });
    this.setState({ process: nextProps.process });
  }

  onHide() {
    this.props.close();
    this.setState({ visibleDialog: false });
  }

  onShow(){
    const process = this.state.process;
    console.log(process);
    if (process !== undefined){
      this.setState({ processName: process.name });
      this.setState({ header: 'Edit compliance process' });
      this.setState({ mode: 'edit'});
    }
  }

  getComplianceProcess(process){
    let complianceProcess;

    if (process === undefined){
      complianceProcess = {
        name: this.state.processName,
        props: this.state.processProps,
        modeltype: 'complianceprocess',
        nodetype: 'complianceprocess'
      };
    } else{
      process.name = this.state.processName;
      complianceProcess = process;
    }
    return complianceProcess;
  }

  addComplianceProcess(){
    const comProcess = this.getComplianceProcess();
    this.props.addProcess(comProcess);
  }

  editComplianceProcess(){
    const comProcess = this.getComplianceProcess(this.state.process);
    this.props.edit(comProcess);
  }

  buttonClick(){
    const mode = this.state.mode;
    if (mode === 'add'){
      this.addComplianceProcess();
    } else if (mode === 'edit'){
      this.editComplianceProcess();
    }
    this.onHide();
  }

  render() {
    const footer = (
      <div>
        <Button label="Ok" onClick={this.buttonClick}/>
        <Button label="Abort" onClick={this.onHide}/>
      </div>
    );

    return (
      <div className="content-section implementation">
        <Dialog
          header={this.state.header}
          footer={footer}
          visible={this.state.visibleDialog}
          style={{width: '80vw'}}
          onShow={this.onShow}
          onHide={this.onHide}
          maximizable
        >
          <div>
            <label htmlFor="processName">Name</label>
            <InputText
              id="processName"
              value={this.state.processName}
              onChange={e => this.setState({processName: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="processRule">Rule</label>
            <InputText
              id="processRule"
              value={this.state.processRule}
              onChange={e => this.setState({processRule: e.target.value})}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default ProcessDialog;
